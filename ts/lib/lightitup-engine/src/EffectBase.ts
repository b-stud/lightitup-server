import Led from './LED';
import EffectsUtils from './EffectsUtils';
import Point from './Point';
import Color from './Color';


/**
 * Effect base class
 */
export default abstract class EffectBase {

    static _name: string; // Effect unique name
    easingFn: Function;   // Easing function to use to compute progress state
    initialized = false;  // True if effect has been initialized


    /**
     * Morph color A to color B by a factor equal to percent
     * @param {Color} colorA
     * @param {Color} colorB
     * @param {number} percent
     * @returns {Color}
     */
    public static smooth(colorA: Color, colorB: Color, percent: number): Color {
        const Ra = colorA.R;
        const Ga = colorA.G;
        const Ba = colorA.B;
        const Rb = colorB.R;
        const Gb = colorB.G;
        const Bb = colorB.B;
        const currentColor = new Color(0, 0, 0);
        currentColor.R = Color._safeLimit(Ra + (Rb - Ra) * percent);
        currentColor.G = Color._safeLimit(Ga + (Gb - Ga) * percent);
        currentColor.B = Color._safeLimit(Ba + (Bb - Ba) * percent);
        return currentColor;
    }


    /**
     * Reset the effect
     */
    public forceReinitialize() {
        this.initialized = false;
    }

    /**
     * Return the effect easing function
     * @param {string | Array<number>} easingOpt
     * @returns {Function}
     */
    public getEasingFn(easingOpt: string | Array<number>): Function {
        const easing = easingOpt || 'linear';
        let fn = null;
        if (null != easing) {
            switch (Array.isArray(easing)) {
                case true: // Bezier points
                    const p1 = new Point(<number>easing[0], <number>easing[1]);
                    const p2 = new Point(<number>easing[2], <number>easing[3]);
                    fn = (t: number) => {
                        return EffectsUtils.Easing.cubicBezier(p1, p2, t);
                    };
                    break;
                case false: // Easing function name
                    fn = (t: number) => {
                        return EffectsUtils.Easing[<string>easing](t);
                    };
                    break;
            }
        }
        return fn;
    }

    /**
     * Set the effect easing function
     * @param {string | Array<number>} easingOpt If it's an array, will be interpreted as a Bezier
     * control points array [x1, y1, x2, y2], else it must be a string referring to the an easing function name
     * as defined inside EffectUtils class
     */
    public setEasingFn(easingOpt: string | Array<number>): void {
        this.easingFn = this.getEasingFn(easingOpt);
    }

    /**
     * Adjust the computed state regarding to the easing function
     * @param {number} percentValue
     * @param useFn
     * @returns {number}
     */
    public ease(percentValue: number, useFn: any = null): number {
        return ((null != useFn) ? this.getEasingFn(useFn) : this.easingFn)(percentValue);
    }

    /**
     * Compute the current progress state of the effect
     * @param {number} animationStartedTime
     * @param {number} animationTime
     * @param {number} currentTime
     * @param useEaseFn
     * @returns {number}
     */
    public percentState(animationStartedTime: number, animationTime: number,
                        currentTime: number, useEaseFn: any = null): number {
        return this.ease(((currentTime - animationStartedTime) % animationTime)
                                    / (animationTime), useEaseFn);
    }


    /**
     * Processing the effect (apply it to each LEDs of the LEDs array)
     * @param options
     * @param {Array<LED>} LEDs
     * @param {number} animationStartedTime
     * @param {number} animationTime
     * @param {number} currentTime
     */
    public abstract process(options: any, LEDs: Array<Led>, animationStartedTime: number,
                            animationTime: number, currentTime: number): void;

}


