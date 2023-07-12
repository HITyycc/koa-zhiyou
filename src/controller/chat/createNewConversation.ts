import Koa from "koa"
import { createNewConveration as mysqlCreateNewConveration } from "@src/lib/chat"


export const createNewConveration = async (ctx: Koa.Context) => {
    const userId = ctx.state.user.userId
    ctx.status = 200
    try {
        const newId = await mysqlCreateNewConveration(ctx, userId)
        ctx.body = {
            errorCode: 0,
            message: "成功创建新会话",
            data: {
                newId: newId
            }
        }
    }catch(err){
        throw  new ctx.customError({
            errorCode: 1,
            message: "创建会话失败",
            code: 500
        })
    }
}