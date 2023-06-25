import Koa from "koa"

export const changeUserInfo = (ctx: Koa.Context) => {
    ctx.body = "change user info api"

}