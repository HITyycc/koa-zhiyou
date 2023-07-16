import Router from "koa-router";
import { DefaultState, Context, Next } from "koa";
import Config from "config"
import RPCClient from "@alicloud/pop-core"

const aliSr_url = Config.get("aliSr.url") as string
const aliSr_AccessKey = Config.get("aliSr.AccessKey") as string
const aliSr_AccessSecret = Config.get("aliSr.AccessSecret") as string
const aliSr_endpoint = Config.get("aliSr.endpoint") as string
const aliSr_apiVersion = Config.get("aliSr.apiVersion") as string
const aliSr_appkey = Config.get("aliSr.appkey") as string

interface tokenType {
    UserId: string,
    Id: string,
    ExpireTime: number
}

let token: tokenType

const getToken = async () => {
    const client = new RPCClient({
        accessKeyId: aliSr_AccessKey,
        accessKeySecret: aliSr_AccessSecret,
        endpoint: aliSr_endpoint,
        apiVersion: aliSr_apiVersion
    })
    try{
        const res = await client.request<{
            ErrMsg: string,
            Token: tokenType
        }>("CreateToken", {})
        const now = Date.now()/1000
        setTimeout(() => {
            getToken().then(data => token = data).catch(err => console.log(err))
        }, token.ExpireTime - now - 60*20)
        return res.Token
    }catch(err){
        // 出错就十秒后重新获取
        setTimeout(() => {
            getToken().then(data => token = data).catch(err => console.log(err))
        }, 10000)
        return {
            UserId: "null",
            Id: "null",
            ExpireTime: 0
        }
    }
}

getToken().then(data => token = data).catch(err => console.log(err))

const routers = new Router<DefaultState, Context>();

routers.prefix("/ws");
routers.all("/speech2text", async (ctx: Context) => {
    // 验证token的有效期
    if(Date.now()/1000 > token.ExpireTime - 60*10){
        ctx.websocket.close(1013, "aliSt failed")
    }

    ctx.websocket.on("message", (msg) => {
        console.log(msg)
    })
})

export default routers