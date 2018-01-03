import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Apply a simple color to all LEDs
 */
export default class SimpleColorEffect extends EffectBase {

    static _name = 'simple-color';

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        const color = new Color(options.color[0], options.color[1], options.color[2]);
        leds.forEach((led) => {
            led.color = Color.clone(color);
        });
    }
}
