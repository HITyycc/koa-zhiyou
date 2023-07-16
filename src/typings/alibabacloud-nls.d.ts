
declare module "alibabacloud-nls" {
    interface SpeechTranscriptionConfig {
        url: string
        token: string
        appkey: string
    }

    interface StartParams {
        format: string,
        sample_rate: number,
        enable_intermediate_result: true,
        enable_inverse_text_normalization: true
    }

    type event = "started" | "changed" | "completed" | "closed" | "failed" | "begin" | "end"
    
    class SpeechTranscription {
        constructor(config: SpeechTranscriptionConfig)
        on: (which: event, handler: () => void) => void
        start: (param: StartParams, enablePing: boolean, pingInterval: number) => Promise<string>
        close: (param: Object) => Promise<object>
        shutdown: () => void
        sendAudio: (data: any) => void
    }

}