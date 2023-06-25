import jwt from "jsonwebtoken"
import Config from "config"


export const toMysqlDatetime = (datetime: Date) => {
    return datetime.toISOString().slice(0, 19).replace('T', ' ');
}


const jwtSecret = Config.get("jwt.secret") as string
export const generateJwtToken = (data: object, expire: string | number | undefined) => {
    const token = jwt.sign(data, jwtSecret, {
        expiresIn: expire
    })
    return token
}