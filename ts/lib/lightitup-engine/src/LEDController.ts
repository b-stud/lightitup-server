import LED from './LED';
import Color from './Color';

/**
 * LEDs array initializer + accessor
 */
export default class LEDSController {

    static LEDs: Array<LED> = [];

    /**
     * Fill the set with expected count LEDs
     * @param {Number} LEDsCount
     */
    static createAll(LEDsCount: Number = 1) {
        LED.reset();
        LEDSController.LEDs = [];
        for (let i = 0; i < LEDsCount; i++) {
            LEDSController.LEDs.push(new LED(Color.Off));  // switched off by default
        }
    }

    /**
     * Get all LEDs
     * @returns {Array<LED>}
     */
    static getAll() {
        return LEDSController.LEDs;
    }
}
