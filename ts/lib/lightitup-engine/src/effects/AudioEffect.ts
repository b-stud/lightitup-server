import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Music dancing moving with audio signal
 * Important NOTE: This Effect is a simple Javascript class and has no access to an audio device
 * If you want to use it, it's up to you to update the AudioEffect.current_rms_value (from 0 to 1)
 */
export default class AudioEffect extends EffectBase {

    static _name = 'audio';
    static current_rms_value = 0; // Will be manually updated by the server
    lowLevelColor: Color;  // Low power signal Color
    highLevelColor: Color; // High power signal Color
    slices: Array<any>; // High power signal Color
    linear = false;
    advanced = false;
    smooth = false;
    count = 0;
    reverse = false;
    colorOFF = new Color(0, 0, 0);


    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        if (!this.initialized) {
            this.initialized = true;
            this.count = leds.length;
            this.reverse = options.direction === 'reverse';
            this.linear = (options.linear === true);
            if (options.advanced === true) {
                this.slices = options.slices;
                this.advanced = true;
                this.smooth = options.smooth || false;
            } else {
                this.lowLevelColor = new Color(options.slices[0][0], options.slices[0][1], options.slices[0][2]);
                this.highLevelColor = new Color(options.slices[1][0], options.slices[1][1], options.slices[1][2]);
                this.advanced = false;
            }
        }

        let currentColor: Color;

        switch (this.linear) {

            case false:
                if (this.advanced) {
                    for (let i = 0; i < this.slices.length; i++) {
                        if (100 * AudioEffect.current_rms_value <= this.slices[i][1]) {
                            if (this.smooth && i < this.slices.length - 1) {
                                const colorA = new Color(this.slices[i][2][0], this.slices[i][2][1],
                                    this.slices[i][2][2]);
                                const colorB = new Color(this.slices[i + 1][2][0], this.slices[i + 1][2][1],
                                    this.slices[i + 1][2][2]);
                                currentColor = EffectBase.smooth(colorA, colorB, AudioEffect.current_rms_value);
                            } else {
                                currentColor = new Color(this.slices[i][2][0], this.slices[i][2][1],
                                    this.slices[i][2][2]);
                            }
                            break;
                        }
                    }
                } else {
                    currentColor = EffectBase.smooth(this.lowLevelColor, this.highLevelColor,
                        AudioEffect.current_rms_value);
                }
                leds.forEach((led) => {
                    led.color = currentColor;
                });
                break;


            case true:
                const breakPoint = Math.floor(AudioEffect.current_rms_value * (this.count - 1));
                if (this.advanced) {
                    let currentCursor = 0;
                    for (let i = 0; i < this.slices.length; i++) {
                        const currentSliceBreakPoint = (i === this.slices.length - 1) ? this.count - 1 :
                            Math.floor(0.01 * this.count * this.slices[i + 1][0]);

                        for (let j = currentCursor; j <= currentSliceBreakPoint && j <= breakPoint; j++) {
                            const colorA = new Color(this.slices[i][2][0], this.slices[i][2][1], this.slices[i][2][2]);
                            let colorB = null;
                            if (i === this.slices.length - 1) {
                                colorB = new Color(this.slices[i][2][0], this.slices[i][2][1], this.slices[i][2][2]);
                            } else {
                                colorB = new Color(this.slices[i + 1][2][0], this.slices[i + 1][2][1],
                                    this.slices[i + 1][2][2]);
                            }
                            if (this.smooth) {
                                const smoothFactor = (j - currentCursor) / (currentSliceBreakPoint - currentCursor);
                                currentColor = EffectBase.smooth(colorA, colorB, smoothFactor);
                            } else {
                                currentColor = (i === this.slices.length - 1) ? colorB : colorA;
                            }
                            if (this.reverse) {
                                leds[this.count - 1 - j].color = currentColor;
                            } else {
                                leds[j].color = currentColor;
                            }
                        }
                        currentCursor = currentSliceBreakPoint + 1;
                    }
                    for (let i = breakPoint; i < this.count; i++) {
                        if (this.reverse) {
                            leds[this.count - 1 - i].color = this.colorOFF;
                        } else {
                            leds[i].color = this.colorOFF;
                        }
                    }
                } else {
                    leds.forEach((led, index) => {
                        if (this.reverse) {
                            led = leds[this.count - 1 - index];
                        }
                        if (index < breakPoint) {
                            led.color = EffectBase.smooth(this.lowLevelColor, this.highLevelColor,
                                this.reverse ? ((this.count - index) / this.count) : (index / this.count));
                        } else {
                            led.color = this.colorOFF;
                        }
                    });
                }
                break;
        }


    }
}
