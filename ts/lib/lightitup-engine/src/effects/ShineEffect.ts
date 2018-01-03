import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Randomly set LEDs luminosity to make it shine
 */
export default class ShineEffect extends EffectBase {

    static _name = 'shine';
    colors: Array<Color> = [];
    lastStep: number = NaN;

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        if (!this.initialized) {
            this.colors = [];
            this.colors.push(new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]));

            // lightVariationPercent refers to the maximum brightness percent change from the base color
            const lightVariation = Math.min(options.lightVariationPercent, 100);

            const color2_HSLA = Color.toHSL(this.colors[0]);
            // color2_HSLA.H = (color2_HSLA.H+lightVariation/360)%360;
            color2_HSLA.L = Math.max(0, Math.min(1, (color2_HSLA.L + lightVariation / 100)));
            this.colors.push(Color.fromHSL(color2_HSLA));

            const color3_HSLA = Color.toHSL(this.colors[0]);
            // color3_HSLA.H = (color3_HSLA.H-lightVariation/360)%360;
            color3_HSLA.L = Math.max(0, Math.min(1, (color3_HSLA.L + lightVariation / 100)));
            this.colors.push(Color.fromHSL(color3_HSLA));

            this.initialized = true;
        }

        const currentStep = Math.floor((currentTime - animationStartedTime) / options.stepTime);
        if (this.lastStep !== currentStep) {
            leds.forEach((led) => {
                const rnd = Math.ceil(Math.random() * 3) - 1;
                led.color = this.colors[rnd];
            });
            this.lastStep = currentStep;
        }
    }
}
