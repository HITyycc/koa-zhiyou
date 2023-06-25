import Koa from "koa"

export const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
    try{
        await next()
        if(ctx.status == 404){
            throw new HttpException({
                message: "Not Fount",
                code: 404
            })
        }
        ctx.status = 200
    }catch(err){
        if(err instanceof HttpException){
            ctx.status = err.code
            ctx.body = {
                code: err.code,
                message: err.message,
                errorCode: err.errorCode
            }
        }else if((err as {status?:number})?.status == 401){
            ctx.status = 401
            ctx.body = "Protected resource, use Authorization header to get access"
        }else{
            ctx.status = 500
            ctx.app.emit('error', err, ctx)
        } 
    }
}

interface ErrorProps {
    message: string
    code?: number,
    errorCode?: number
}

export class HttpException extends Error {
    code: number
    errorCode: number
    constructor({message, code=500, errorCode=-1}: ErrorProps){
        super()
        this.message = message
        this.code = code
        this.errorCode = errorCode
    }
}