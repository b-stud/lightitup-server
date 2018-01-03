import Color from './Color';

/**
 * LED representation
 */
export default class LED {

    public static count = 0; // To assign unique IDs
    public id: number; // LED unique ID

    constructor(public color: Color) {
        this.id = LED.count++;
    }

    static reset() {
        LED.count = 0; // To count again from 0
    }
}
