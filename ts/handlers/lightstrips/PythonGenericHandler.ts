/**
 * A generic wrapper for Python handlers
 */
import LightStripHandlerAbstract from './LightStripHandlerAbstract';

const PythonShell = require('python-shell');

export default class WS281XHandler extends LightStripHandlerAbstract {

    private initialized: boolean = false;
    private offArray: Array<Array<number>> = [];
    private shell = null;
    private LEDsCount = 0;
    public scriptName = '';
    public scriptPath = '';

    public constructor(){
        super();
    }

    public init(LEDsCount: number, opts: any = {}): LightStripHandlerAbstract {
        this.LEDsCount = LEDsCount;
        super.init(LEDsCount, opts);
        for(let i = 0; i < this.LEDsCount; i++){
            this.offArray.push([0,0,0]);
        }
        try {
            this.shell = new PythonShell(this.scriptName, {
                mode: 'json',
                pythonPath: 'python',
                pythonOptions: ['-u'],
                scriptPath: this.scriptPath,
                args: [
                    LEDsCount,
                    opts.SPI.DEVICE,
                    opts.SPI.PORT,
                    opts.SPI.CLK_PIN,
                    opts.SPI.DATA_PIN
                ]
            });
            this.initialized = true;
        }
        catch(e){
            console.error(e);
        }
        return this;
    }

    open(): LightStripHandlerAbstract {
        return this;
    }

    isOpened(): boolean{
        return this.initialized;
    }

    close(): LightStripHandlerAbstract{
        if(this.isOpened()){
            try {
                this.clear();
                this.shell.childProcess.kill();
                this.shell = null;
                this.initialized = false;
            } catch(e){
            }
        }
        return this;
    }

    update(colorsArray: Array<Array<number>>): LightStripHandlerAbstract{
        if(this.isOpened()){
            this.shell.send(LightStripHandlerAbstract.adjust(colorsArray));
        }
        return this;
    }

    clear(): LightStripHandlerAbstract{
        this.update(this.offArray);
        return this;
    }
}