import Router from "koa-router"
import { DefaultState, Context, Next } from "koa"
import authController from "@src/controller/auth"
import chatController from "@src/controller/chat"

const routers = new Router<DefaultState, Context>()

routers.prefix("/auth")

routers.get('/login', authController.login)
routers.post('/getsmscode', authController.getSmsCode)
routers.post('/verifysmscode', authController.verifySmsCode)

export default routers