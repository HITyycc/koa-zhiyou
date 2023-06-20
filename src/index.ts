const env = process.env.NODE_ENV?.trim()

if(env == 'production'){
    require('module-alias/register')
}

import Koa from "koa"
import routers from "./routes"
import bodyParser from "koa-bodyparser"
import logger from "koa-logger"

console.log(`environment is ${process.env.NODE_ENV}`)

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(routers.routes());
app.listen(3000);
