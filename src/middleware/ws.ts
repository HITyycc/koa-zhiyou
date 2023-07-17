import Koa from "koa"
import jwt from "koa-jwt"
import Config from "config"

const jwtSecret = Config.get("jwt.secret") as string
export const wsAuth = async (ctx: Koa.Context, next: Koa.Next) => {
    try{
        if(ctx.query.Authorization){
            ctx.header.authorization = ctx.query.Authorization as string
        }
        await jwt({secret: jwtSecret})(ctx, next)
    }catch(err) {
        ctx.websocket.close(1012, "Authentication fails")
        return
    }
    await next()
}