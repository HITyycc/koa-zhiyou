import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import Config from "config"
import { HttpException } from '@src/middleware/errorHandler';


export const codeGenerator = (digit: number): string => {
    let randomNum = Math.random()
    while(randomNum == 0){
        randomNum = Math.random()
    }
    let code = randomNum.toString().split(".")[1].slice(-digit)
    code = code.padStart(digit-code.length, '0')
    return code
}

const smsClientConfig = new $OpenApi.Config({
    accessKeyId: Config.get("smsAccess.AccessKey"),
    accessKeySecret: Config.get("smsAccess.AccessSecret")
})

smsClientConfig.endpoint = `dysmsapi.aliyuncs.com`;
const smsClient = new Dysmsapi20170525(smsClientConfig);

export const smsSender = async (code: string, phoneNumber: string) => {
    
        const smsRequestProps = {
            templateCode: Config.get("smsAccess.loginTemplateCode") as string,
            templateParam: `{"code":"${code}"}`,
            signName: Config.get("smsAccess.signName") as string,
            phoneNumbers:phoneNumber
        }
        console.log(smsRequestProps)
        let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest(smsRequestProps)
        const res = await smsClient.sendSmsWithOptions(sendSmsRequest, new $Util.RuntimeOptions({ }))
        if(res.body.code !== "OK") throw new Error()
    
    
}
