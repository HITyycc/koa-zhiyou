import Router from "koa-router"
import { DefaultState, Context } from "koa"
import wsRouter from "./ws"


const routers = new Router<DefaultState, Context>()

routers.use(wsRouter.routes())

export default routers