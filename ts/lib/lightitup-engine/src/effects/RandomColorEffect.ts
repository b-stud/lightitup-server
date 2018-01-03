import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Randomly apply a Color to the LEDs (all the same or all different) for a certain time
 */
export default class RandomColorEffect extends EffectBase {

    static _name = 'random-color';
    lastChangeTime: number = NaN;
    nextColor: any;
    nextColorsArray: Array<any> = [];
    currentBaseColor: any;
    currentBaseColorsArray: Array<any> = [];

    static getBrightColor(): Color {
        const rgb: Array<any> = [];
        rgb[0] = Math.random() * 256; // red
        rgb[1] = Math.random() * 256; // green
        rgb[2] = Math.random() * 256; // blue
        let max: number = NaN, min: number = NaN, notmax: number = NaN;
        if (rgb[0] > rgb[1]) {
            max = (rgb[0] > rgb[2]) ? 0 : 2;
            min = (rgb[1] < rgb[2]) ? 1 : 2;
        } else {
            max = (rgb[1] > rgb[2]) ? 1 : 2;
            notmax = 1 + max % 2;
            min = (rgb[0] < rgb[notmax]) ? 0 : notmax;
        }
        rgb[max] = 255;
        rgb[min] = 0;
        rgb.forEach((val, index) => {
            rgb[index] = Math.floor(rgb[index]);
        });
        return new Color(rgb[0], rgb[1], rgb[2]);
    }

    static getRandomColor(bright: boolean = true): Color {
        if (bright) {
            return RandomColorEffect.getBrightColor();
        } else {
            const r = Math.floor(Math.random() * 255) + 1;
            const g = Math.floor(Math.random() * 255) + 1;
            const b = Math.floor(Math.random() * 255) + 1;
            return new Color(r, g, b);
        }
    }

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        if (!this.initialized) {
            this.setEasingFn(options.easing);
            this.currentBaseColor = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
            if (options.byled) {
                leds.forEach((led) => {
                    const base = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
                    this.currentBaseColorsArray.push(base);
                    led.color = Color.clone(base);
                    this.nextColorsArray.push(RandomColorEffect.getRandomColor(
                                                                        options.bright ? options.bright : true));
                });
            } else {
                this.nextColor = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
                leds.forEach((led) => {
                    led.color = Color.clone(this.currentBaseColor);
                });
            }
            this.initialized = true;
            return;
        }
        let setColor: Color;
        if (options.smooth) {
            // Changing step
            if (isNaN(this.lastChangeTime) || this.lastChangeTime > currentTime
                || currentTime - this.lastChangeTime > options.stepTime) {
                if (!options.byled) {
                    if (null != this.nextColor) { // Not the first time
                        this.currentBaseColor = Color.clone(this.nextColor);
                    }
                    this.nextColor = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
                } else {
                    for (let i = 0; i < leds.length; i++) {
                        this.currentBaseColorsArray[i] = Color.clone(this.nextColorsArray[i]);
                        this.nextColorsArray[i] = RandomColorEffect.getRandomColor(
                                                                        options.bright ? options.bright : true);
                    }
                }
                this.lastChangeTime = currentTime;
            }
            const percent = this.percentState(this.lastChangeTime, options.stepTime, currentTime);

            if (!options.byled) {
                const currentColor = EffectBase.smooth(this.currentBaseColor, this.nextColor, percent);
                setColor = currentColor;
            } else {
                leds.forEach((led) => {
                    const currentColor = EffectBase.smooth(this.currentBaseColorsArray[led.id],
                        this.nextColorsArray[led.id], percent);
                    led.color = Color.clone(currentColor);
                });
            }
        } else if (this.lastChangeTime > currentTime || isNaN(this.lastChangeTime)
            || currentTime - this.lastChangeTime > options.stepTime) {
            if (!options.byled) {
                setColor = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
            } else {
                leds.forEach((led) => {
                    led.color = RandomColorEffect.getRandomColor(options.bright ? options.bright : true);
                });
            }
            this.lastChangeTime = currentTime;
        } else {
            return;
        }

        if (!options.byled) {
            leds.forEach((led) => {
                led.color = Color.clone(setColor);
            });
        }
    }
}
