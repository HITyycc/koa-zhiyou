import Koa from "koa"
import { chatContentOneRow, insertChatContentList as mysqlinsertChatContentList } from "@src/lib/chat"

interface bodyType {
    chatId: string,
    newChatContentList: Array<chatContentOneRow>
}

export const insertChatContentList = async (ctx: Koa.Context) => {
    const userId = ctx.state.user.userId
    const chatId = (ctx.request.body as bodyType).chatId
    const newChatContentList = (ctx.request.body as bodyType).newChatContentList
    ctx.status = 200
    try {
        const newId = await mysqlinsertChatContentList(ctx, userId, chatId, newChatContentList)
        ctx.body = {
            errorCode: 0,
            message: "成功插入记录"
        }
    }catch(err){
        if(err instanceof ctx.customError) throw err
        throw  new ctx.customError({
            errorCode: 2,
            message: "记录插入失败",
            code: 500
        })
    }
}