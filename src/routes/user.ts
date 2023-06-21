import Router from "koa-router"
import { DefaultState, Context } from "koa"
import userController from "@src/controller/user"

const routers = new Router<DefaultState, Context>()

routers.prefix("/user")

routers.get('/login', userController.login)
routers.post('/getsmscode', userController.getSmsCode)

export default routers