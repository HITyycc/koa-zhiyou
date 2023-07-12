import Koa from "koa"
import axios from "axios"
import Config from "config"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { getChatContentList as mysqlGetChatContentList, insertChatContentList as mysqlInsertChatContentList } from "@src/lib/chat"
import { IncomingMessage } from "http"
import { PassThrough } from "stream"

interface requestBody {
    chatId: string,
    message: string
}

const chatGptStream = async (ctx: Koa.Context):Promise<string> => {
    const userId = ctx.state?.user?.userId
    const chatId = (ctx.request.body as requestBody).chatId
    const chatContentList = await mysqlGetChatContentList(ctx, userId, chatId as string)
    const userContent = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: (ctx.request.body as requestBody).message
    }
    chatContentList.push(userContent)
    const openAiConfig = new Configuration({
        apiKey: Config.get("openai.openKey"),
    })
    const openai = new OpenAIApi(openAiConfig)
    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: chatContentList,
        stream: true
    }, { responseType: 'stream', proxy:{
        host: "127.0.0.1",
        port: 7890
    }})
    const stream = chatCompletion.data as unknown as IncomingMessage;
    const streamSender = ctx.body as PassThrough
    return new Promise((resolve, reject) => {
        let message = ""
  
        streamSender.on("close", () => {
            stream.destroy()
            resolve(message)
        })
        stream.on("data", chunck => {
            const payloads = chunck.toString().split("\n\n")
            for (const payload of payloads) {
                if (payload.includes('[DONE]')) {
                    streamSender.write(`data: [DONE]\n\n`)
                }else if (payload.startsWith("data:")) {
                    try{
                        const data = JSON.parse(payload.replace("data: ", ""))
                        const word = data?.choices?.[0].delta?.content ?? ""
                        message += word
                        streamSender.write(`data: #${word}\n\n`)
                    }catch(err){
                        console.log("json parse error")
                    }
                }
            }
        })
        stream.on('end', () => {
            resolve(message)
        })
        stream.on('error', (err) => {
            streamSender.write(`event: error\ndata: ${err}\n\n`);
            reject(message)
        })
    })
}


export const getChatGptResponse = async (ctx: Koa.Context) => {
    ctx.response.status = 200
    ctx.res.setHeader("Content-Type", "text/event-stream;charset=utf-8")
    ctx.res.setHeader("Cache-Control", "no-cache")
    const streamSender = new PassThrough()
    ctx.body = streamSender
    chatGptStream(ctx).then(data => {
        const newChatContent:Array<{role:ChatCompletionRequestMessageRoleEnum, content:string}> = [{
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: (ctx.request.body as requestBody).message,
        }]
        if(data.length != 0){
            newChatContent.push({
                role: ChatCompletionRequestMessageRoleEnum.Assistant,
                content: data
            })
        }
        mysqlInsertChatContentList(ctx, ctx.state?.user?.userId, (ctx.request.body as requestBody).chatId, newChatContent)
    })

    
}