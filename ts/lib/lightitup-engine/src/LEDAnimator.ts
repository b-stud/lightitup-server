import Led from './LED';
import EffectConfig from './EffectConfig';
import EffectController from './EffectController';
import LEDSController from './LEDController';
import StepTimeAbstract from "./effects/utils/StepTimeAbstract";

/**
 * Effects assignment manager
 */
export default class LEDAnimator {

    static effects: Array<EffectConfig> = []; // Stores all the effects of the current animation
    static startTime = NaN; // Time reference to the animation beginning

    /**
     * Prevents an effect to be played (for example when its repeat limit or limit time is reached)
     * @param {number} index Effect index inside the effects Array
     */
    static stopEffect(index: number): void {
        LEDAnimator.effects[index].enabled = false;
    }

    /**
     * Re-enable all stopped effects
     */
    static enableAllEffects(): void {
        LEDAnimator.effects.forEach((effect: EffectConfig) => {
            effect.enabled = true;
        });
    }

    /**
     * Iterate through all the effects, apply them to the LEDs and send back the updated LEDs to the callback
     * @param {Function} callback
     * @param {boolean} reset
     * @param {number} currentEffectStartTime
     */
    static processLEDs(callback: Function, reset: boolean = false, currentEffectStartTime: number = NaN) {
        const time = new Date().getTime();
        LEDAnimator.enableAllEffects(); // Re-enabling effects for this iteration
        callback(LEDAnimator.processEffects(LEDSController.getAll(), time, reset, currentEffectStartTime));
    }

    /**
     * Apply effects on LEDs array
     * @param {Array<LED>} LEDs
     * @param {number} time
     * @param {boolean} reset
     * @param {number} currentEffectStartTime
     */
    static processEffects(LEDs: Array<Led>, time: number, reset: boolean = false,
                          currentEffectStartTime: number = NaN): Array<Led> {

        // If animation must be resetted
        if (reset || !LEDAnimator.startTime) {
            LEDAnimator.startTime = new Date().getTime();
        }

        // If animation should be resumed at a specified time
        if (!isNaN(currentEffectStartTime)) {
            LEDAnimator.startTime = currentEffectStartTime;
        }

        // Effects application loop
        LEDAnimator.effects.forEach((effect: EffectConfig, index) => {

            if (!effect.isEnabled || !effect.isActivated) {
                return; // Do nothing if effect has ended for this iteration
            }

            const duration = effect.options.duration || 0; // Current effect duration
            const delay = effect.options.delay || 0; // Current effect delay (time before it starts)
            const waitAtEnd = effect.options.waitAtEnd || 0; // Time to wait at end of current effect before resetting
            const repeat = effect.options.repeat || NaN; // Number of times to repeat the current effect

            // Stop the effect if it's over
            if (!isNaN(repeat) && ((time - LEDAnimator.startTime + delay) / (duration + waitAtEnd) > repeat)) {
                return LEDAnimator.stopEffect(index);
            }

            // Do nothing if effect is not in active state regarding to its delay, duration and waitAtEnd time
            if (delay + waitAtEnd + duration !== 0) {
                if (
                    (time - LEDAnimator.startTime) % (delay + duration + waitAtEnd) < delay
                    ||
                    (waitAtEnd !== 0
                        && (time - LEDAnimator.startTime) % (delay + duration + waitAtEnd) >= delay + duration)
                ) {
                    if ((<StepTimeAbstract>effect.instance) instanceof StepTimeAbstract) {
                        (<StepTimeAbstract>effect.instance).resetStep(time);
                    }
                    return;
                }
            }

            // Time reference to make the effects know from when to compute the state
            const thisEffectStartTime = (time - LEDAnimator.startTime)
                - (delay + duration + waitAtEnd)
                * Math.floor((time - LEDAnimator.startTime) / (delay + duration + waitAtEnd));

            // Apply the effect
            EffectController.applyEffect(LEDs, effect, delay, duration, thisEffectStartTime);

        });
        return LEDs;
    }

    /**
     * Set the effects stack in the given order
     * @param {Array<EffectConfig>} effects
     * @param {boolean} doNotReset If true and effects have attached instances, then these instances will be used
     */
    static setEffects(effects: Array<EffectConfig>, doNotReset: boolean = false): void {
        if (!doNotReset) {
            effects.forEach((effect) => {
                if (effect.instance) {
                    effect.instance.forceReinitialize();
                }
            });
        }
        LEDAnimator.effects = effects;
    }

}