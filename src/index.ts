const env = process.env.NODE_ENV?.trim()

if(env == 'production'){
    require('module-alias/register')
}

import Koa from "koa"
import routers from "./routes"
import bodyParser from "koa-bodyparser"
import logger from "koa-logger"
import { errorHandler } from "./middleware/errorHandler"
import { HttpException } from "./middleware/errorHandler"
import { redisClient } from "./lib/redis"
import { mysqlClient } from "./lib/mysql"

console.log(`environment is ${process.env.NODE_ENV}`)

const app = new Koa()
app.context.customError = HttpException
app.context.redis = redisClient
app.context.mysql = mysqlClient

app.use(errorHandler)
app.use(logger())
app.use(bodyParser())
app.use(routers.routes());
app.listen(3000);
