import authRouter from "@src/routes/auth"
import jwtProtectRoutes from "@src/routes/jwtProtectRoutes"
import Router from "koa-router"
import { DefaultState, Context } from "koa"
import jwt from "koa-jwt"
import Config from "config"


const routers = new Router<DefaultState, Context>()


routers.use(authRouter.routes())

// ====== 上面无需登录 =======

const jwtSecret = Config.get("jwt.secret") as string
routers.use(jwt({
    secret: jwtSecret
}), jwtProtectRoutes.routes())


export default routers