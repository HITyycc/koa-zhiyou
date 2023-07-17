
declare module "alibabacloud-nls" {
    interface SpeechTranscriptionConfig {
        url: string
        token: Object
        appkey: string
    }

    interface StartParams {
        format: string,
        sample_rate: number,
        enable_intermediate_result?: boolean,
        enable_inverse_text_normalization?: boolean,
        enable_punctuation_prediction?: boolean
    }

    type event = "started" | "changed" | "completed" | "closed" | "failed" | "begin" | "end"
    
    class SpeechTranscription {
        constructor(config: SpeechTranscriptionConfig)
        on: (which: event, handler: (msg: Object) => void) => void
        start: (param: StartParams, enablePing: boolean, pingInterval: number) => Promise<string>
        close: (param?: Object) => Promise<object>
        shutdown: () => void
        sendAudio: (data: any) => void
    }

}