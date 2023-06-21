import userRounter from "./user"
import Router from "koa-router"
import { DefaultState, Context } from "koa"

const routers = new Router<DefaultState, Context>()

routers.use(userRounter.routes())

export default routers