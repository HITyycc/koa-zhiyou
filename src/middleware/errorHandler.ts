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

    }catch(err){
        if(err instanceof HttpException){
            ctx.status = err.code
            ctx.body = {
                code: err.code,
                message: err.message
            }
        }
    }
}

interface ErrorProps {
    message: string
    code?: number
}

export class HttpException extends Error {
    code: number
    constructor({message, code=500}: ErrorProps){
        super()
        this.message = message
        this.code = code
    }
}