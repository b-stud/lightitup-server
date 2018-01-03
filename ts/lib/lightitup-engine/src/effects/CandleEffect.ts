import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Simulates a candlelight
 */
export default class CandleEffect extends EffectBase {

    static _name = 'candle';
    maxBrightnessChange: number = NaN; // From the base Color, max brightness change allowed

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        if (!this.initialized) {
            this.setEasingFn('random');
            leds.forEach((led) => {
                led.color = new Color(options.color[0], options.color[1], options.color[2]);
            });
            this.maxBrightnessChange = ((!isNaN(options.maxBrightnessChange) ? options.maxBrightnessChange : 50) / 100);
            this.initialized = true;
        }
        const sign = (0.5 > Math.random()) ? -1 : 1;
        const change = Math.min((this.maxBrightnessChange * 255), 255 * Math.random());
        const color = new Color(
            Math.min(255, Math.round(Math.max(0, options.color[0] + sign * change))),
            Math.min(255, Math.round(Math.max(0, options.color[1] + sign * change))),
            Math.min(255, Math.round(Math.max(0, options.color[2] + sign * change)))
        );
        leds.forEach((led) => {
            led.color = Color.clone(color);
        });
    }
}
