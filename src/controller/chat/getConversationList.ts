import Koa from "koa"
import { getConversationList as mysqlGetConversationList } from "@src/lib/chat"


export const getConversationList = async (ctx: Koa.Context) => {
    const userId = ctx.state.user.userId
    ctx.status = 200
    try {
        const conversationArr = await mysqlGetConversationList(ctx, userId)
        ctx.body = {
            errorCode: 0,
            message: "success",
            data: {
                conversationList: conversationArr
            }
        }
    }catch(err){
        throw new ctx.customError({
            message: "获取用户会话列表失败",
            code: 500,
            errorCode: 1
        })
    }

}
