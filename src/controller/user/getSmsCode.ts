import Koa from "koa"
import { codeGenerator, smsSender } from "@src/lib/codeGenerator"

interface smsBody{
    phoneNumber: string
}

export const getSmsCode = async (ctx: Koa.Context) => {
    const code = codeGenerator(6)
    const phoneNumber = (ctx.request.body as smsBody).phoneNumber
    try{
        await smsSender(code, phoneNumber)
    }catch(err){
        throw new ctx.customError({
        message: "smsError",
        code: 500
        })
    }

}