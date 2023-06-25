import Koa from "koa"
import { codeGenerator, smsSender } from "@src/lib/codeGenerator"
import Config from "config"
import randomstring from "randomstring"
import { toMysqlDatetime, generateJwtToken } from "@src/lib/utils"

const smsCodeExpireTime = Config.get("smsAccess.expireTimeSecond") as number
const smsCodeReGetTime = Config.get("smsAccess.reGetTime") as number

interface smsBody{
    phoneNumber: string
}

export const getSmsCode = async (ctx: Koa.Context) => {
    
    const phoneNumber = (ctx.request.body as smsBody).phoneNumber
    const redisKey = `login:smsMap:${phoneNumber}`
    const resTime = await ctx.redis.ttl(redisKey)
    ctx.status = 200
    
    // 超过一分钟才可以重新获得验证码
    if(resTime > smsCodeExpireTime-smsCodeReGetTime){
        throw new ctx.customError({
            message: "get sms code too frequently",
            code: 400
        })
    }
    const code = codeGenerator(6)

    try{
        await smsSender(code, phoneNumber)
        await ctx.redis.set(redisKey, code, "EX", smsCodeExpireTime)
        
    }catch(err){
        console.log("send")
        console.error(err)
        throw new ctx.customError({
        message: "smsError",
        code: 500
        })
    }

}

interface verifySmsBody {
    phoneNumber: string,
    code: string
}

interface jwtPayload {
    nickname: string,
    avatarUrl: string,
    userId: string
}

interface userInfoDb {
    user_id: string,
    nickname: string,
    avatar_url: string,
    phone_number: string,
    create_at: Date, 
    updated_at: Date
}

export const verifySmsCode = async (ctx: Koa.Context) => {
    const phoneNumber = (ctx.request.body as verifySmsBody).phoneNumber
    const code = (ctx.request.body as verifySmsBody).code
    const redisKey = `login:smsMap:${phoneNumber}`
    const res = await ctx.redis.get(redisKey)
    const resTime = await ctx.redis.ttl(redisKey)
    if(res == null){
        throw new ctx.customError({
            message: "code expired",
            code: 200,
            errorCode: 1
        })
    }

    if(res === code){
        // 判断是否是老用户
        let [rows, fields] = await ctx.mysql.query(`SELECT user_id, nickname, avatar_url FROM user WHERE phone_number=${phoneNumber}`)
        // 注册新用户的信息
        if(rows.length === 0){
            const name = `智友${randomstring.generate({
                length: 10,
                charset: "alphabetic"
            })}`
            const create_at = toMysqlDatetime(new Date())
            const sql = `INSERT INTO user (nickname, phone_number, create_at, updated_at)
                        VALUES
                        ("${name}", "${phoneNumber}", "${create_at}", "${create_at}");`
            await ctx.mysql.execute(sql)
        }
        [rows, fields] = await ctx.mysql.query(`SELECT user_id, nickname, avatar_url, create_at FROM user WHERE phone_number=${phoneNumber}`)
        const jwtUserInfo: jwtPayload = {
            userId: (rows[0] as userInfoDb).user_id,
            avatarUrl: (rows[0] as userInfoDb).avatar_url,
            nickname: (rows[0] as userInfoDb).nickname
        }
        // 赋予token 
        const jwtToken = generateJwtToken(jwtUserInfo, "300s")
        ctx.set("Authorization", "Bearer " + jwtToken)
        ctx.body = {
            errorCode: 0,
            message: "success login"
        }

    }else{
        throw new ctx.customError({
            message: "code not match",
            code: 200,
            errorCode: 2
        })
    }

}