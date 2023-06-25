import userRouter from "@src/routes/jwtProtectRoutes/user"
import Router from "koa-router"
import { DefaultState, Context } from "koa"


const routers = new Router<DefaultState, Context>()

routers.use(userRouter.routes())

export default routers