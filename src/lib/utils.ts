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


const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function decimalTo62(decimal: string | bigint) {
    let num = BigInt(decimal)
    let result = ''
    const base = BigInt(62)
    
    while (num > 0) {
      const remainder = num % base
      result = characters[Number(remainder)] + result
      num = num / base
    }
    
    return result == '' ? '0':result
  }

export function base62ToDecimal(base62: string): string {
    const base = BigInt(62);
    let result = BigInt(0);

    for (let i = 0; i < base62.length; i++) {
        const char = base62[i];
        const charValue = BigInt(characters.indexOf(char));
        result = result * base + charValue;
    }

    return result.toString();
}