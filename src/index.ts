const env = process.env.NODE_ENV?.trim()

if(env == 'production'){
    require('module-alias/register')
}

import Koa, { DefaultContext, DefaultState, Middleware } from "koa"
import routers from "./routes"
import bodyParser from "koa-bodyparser"
import logger from "koa-logger"
import { errorHandler } from "./middleware/errorHandler"
import { HttpException } from "./middleware/errorHandler"
import { redisClient } from "./lib/redis"
import { mysqlClient } from "./lib/mysql"
import cors from "@koa/cors"
import websockify from "koa-websocket"
import wsRouters from "./routes/websocketRoutes"
import { IncomingMessage } from "http"
import * as ws from 'ws';
import { exit } from "process"
import { wsAuth } from "./middleware/ws"

console.log(`environment is ${process.env.NODE_ENV}`)

const app = websockify(new Koa())
app.context.customError = HttpException
app.context.redis = redisClient
app.context.mysql = mysqlClient

app.use(errorHandler)
app.use(cors({
    origin: "http://localhost:19000",
    exposeHeaders: "Authorization"
}))
app.use(logger())
app.use(bodyParser())
app.use(routers.routes());


app.ws.use(wsAuth)
app.ws.use(wsRouters.routes() as Middleware<DefaultState, DefaultContext>)

app.listen(3010);
