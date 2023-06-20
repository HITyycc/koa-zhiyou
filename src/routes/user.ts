import Router from "koa-router"
import Koa from "koa"
import userController from "@src/controller/user"

const routers = new Router()

routers.prefix("/user")

routers.get('/login', userController.login)
routers.post('/getsmscode', userController.getSmsCode)

export default routers