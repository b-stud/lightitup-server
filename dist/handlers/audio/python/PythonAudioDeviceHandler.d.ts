import AudioDeviceHandlerAbstract from "../AudioDeviceHandlerAbstract";
export default class PythonAudioDeviceHandler extends AudioDeviceHandlerAbstract {
    static driver_name: string;
    private shell;
    constructor();
    startListening(deviceIndex: number, latency: number, opts: any, callback: any): void;
    stopListening(): void;
}
