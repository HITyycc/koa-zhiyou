import Koa from "koa"
import { getChatContentList as mysqlGetChatContentList } from "@src/lib/chat"


export const getChatContentList = async (ctx: Koa.Context) => {
    const userId = ctx.state.user.userId
    const chatId = ctx.query.chatId
    ctx.status = 200
    if(chatId){
        try {
            const chatContentList = await mysqlGetChatContentList(ctx, userId, chatId as string)
            ctx.body = {
                errorCode: 0,
                message: "success",
                data: {
                    chatContentList: chatContentList
                }
            }
            
        }catch(err){
            if(err instanceof ctx.customError) throw err
            throw new ctx.customError({
                message: "获取失败",
                code: 500,
                errorCode: 2
            })
        }
    }else{
        throw new ctx.customError({
            message: "未指定会话Id",
            code: 400,
            errorCode: 1
        })
    }

}
