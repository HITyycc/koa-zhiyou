import Router from "koa-router"
import { DefaultState, Context } from "koa"
import userController from "@src/controller/user"

const routers = new Router<DefaultState, Context>()

routers.prefix("/user")

routers.post('/changeuserinfo', userController.changeUserInfo)

export default routers