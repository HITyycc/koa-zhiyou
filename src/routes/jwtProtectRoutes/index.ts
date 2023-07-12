import userRouter from "@src/routes/jwtProtectRoutes/user"
import chatRouter from "@src/routes/jwtProtectRoutes/chat"
import Router from "koa-router"
import { DefaultState, Context } from "koa"


const routers = new Router<DefaultState, Context>()

routers.use(userRouter.routes())
routers.use(chatRouter.routes())

export default routers