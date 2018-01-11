/**
 * A generic wrapper for Python handlers
 */
import LightStripHandlerAbstract from './LightStripHandlerAbstract';
export default class WS281XHandler extends LightStripHandlerAbstract {
    private initialized;
    private offArray;
    private shell;
    private LEDsCount;
    scriptName: string;
    scriptPath: string;
    constructor();
    init(LEDsCount: number, opts?: any): LightStripHandlerAbstract;
    open(): LightStripHandlerAbstract;
    isOpened(): boolean;
    close(): LightStripHandlerAbstract;
    update(colorsArray: Array<Array<number>>): LightStripHandlerAbstract;
    clear(): LightStripHandlerAbstract;
}
