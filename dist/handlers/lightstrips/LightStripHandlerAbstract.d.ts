/**
* Abstract class  (Dependency Injection Pattern)
*/
export default abstract class LightStripHandlerAbstract {
    private static defaultGamma;
    private static gammaCorrectionTable;
    constructor();
    /**
     * Adjust gamma levels, should be called before updating LEDs
     * @param {Array<Array<number>>} colorsArray
     * @returns {Array<Array<number>>} Adjusted levels colors array
     */
    static adjust(colorsArray: Array<Array<number>>): Array<Array<number>>;
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
    init(LEDsCount: number, opts?: any): LightStripHandlerAbstract;
}
