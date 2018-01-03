/**
* Abstract class  (Dependency Injection Pattern)
*/
export default abstract class LightStripHandlerAbstract {
	private static defaultGamma: number = 2.5;	
	private static gammaCorrectionTable: Array<number> = new Array(256);

	public constructor() {}

    /**
	 * Adjust gamma levels, should be called before updating LEDs
     * @param {Array<Array<number>>} colorsArray
     * @returns {Array<Array<number>>} Adjusted levels colors array
     */
    static adjust(colorsArray: Array<Array<number>>): Array<Array<number>> {
        for(let i = 0; i < colorsArray.length; i++){
            colorsArray[i][0] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][0]];
            colorsArray[i][2] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][2]];
            colorsArray[i][1] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][1]];
        }
        return colorsArray;
    };

    /**
	 * Init the connection
     * @returns {LightStripHandlerAbstract}
     */
	abstract open(): LightStripHandlerAbstract;

    /**
	 * Check if the connection is opened
     * @returns {boolean}
     */
    abstract isOpened(): boolean;

    /**
	 *  Close the connection
     * @returns {LightStripHandlerAbstract}
     */
	abstract close(): LightStripHandlerAbstract;

    /**
	 * Update all the LEDs
     * @param {Array<Array<number>>} colorsArray  An array od RGB colors [R,G,B,R,G,B,........]
     * @returns {LightStripHandlerAbstract}
     */
	abstract update(colorsArray: Array<Array<number>>): LightStripHandlerAbstract;

    /**
	 * Switch off all the LEDs
     * @returns {LightStripHandlerAbstract}
     */
	abstract clear(): LightStripHandlerAbstract;

    /**
     * Initialize the handler
     * @param {number} LEDsCount Number of leds
     * @param opts
     * @returns {LightStripHandlerAbstract}
     */
	public init(LEDsCount: number, opts: any = {}): LightStripHandlerAbstract{
		for (let i=0; i<256; i++){ //Populating gamma table
			LightStripHandlerAbstract.gammaCorrectionTable[i] = Math.round(255*Math.pow(i/255,  opts.gamma || LightStripHandlerAbstract.defaultGamma));
		}
		return this;
	}
}