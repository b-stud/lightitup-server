import AudioDeviceHandlerAbstract from "../AudioDeviceHandlerAbstract";

const PythonShell = require('python-shell');
const path = require('path');

export default class PythonAudioDeviceHandler extends AudioDeviceHandlerAbstract {

    public static driver_name: string = 'Python_Audio_Driver';
    private shell: any = null;

    constructor() {
        super();
    }

    startListening(deviceIndex: number, latency: number, opts: any, callback: any){
        this.shell = new PythonShell('analyzer.py', {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.resolve(__dirname, '../../../../bin/py/audio'),
            args: [deviceIndex, latency, opts.frequencyBand[0], opts.frequencyBand[1]]
        });
        this.shell.on('message', (message) => {
            callback(message);
        });
    }

    stopListening(){
        if(this.shell) {
            this.shell.childProcess.kill();
            this.shell = null;
        }
    }

}