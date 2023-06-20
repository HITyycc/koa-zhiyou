import userRounter from "./user"
import Router from "koa-router"

const routers = new Router()

routers.use(userRounter.routes())

export default routers