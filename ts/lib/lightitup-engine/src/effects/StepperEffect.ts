import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * States effect
 * Navigates from a state (Color) to the next one by the specified time, smoothly or not
 */
export default class StepperEffect extends EffectBase {

    static _name = 'stepper';

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {
        if (!this.initialized) {
            const step = options.steps[0];
            leds.forEach((led) => {
                led.color = new Color(step[1], step[2], step[3]);
            });
            this.initialized = true;
        }
        if (options.steps.length === 1) {
            const step = options.steps[0];
            leds.forEach((led) => {
                led.color = new Color(step[1], step[2], step[3]);
            });
            return;
        } else if (!options.smooth) {
            leds.forEach((led) => {
                const currentPeriodTime = (currentTime - animationStartedTime) % animationTime;
                options.steps.forEach((step: any, index: number) => {
                    if (currentPeriodTime >= step[0]
                        && (index === options.steps.length - 1 || step[0] < options.steps[index + 1][0])) {
                        led.color = new Color(step[1], step[2], step[3]);
                        return;
                    }
                });
            });
        } else {
            const currentPeriodTime = (currentTime - animationStartedTime) % animationTime;
            let currentStepIndex = NaN;
            options.steps.forEach((step: any, index: number) => {
                if (currentPeriodTime >= step[0]
                    && (index === options.steps.length - 1 || step[0] < options.steps[index + 1][0])) {
                    currentStepIndex = index;
                    return;
                }
            });
            const currentStep = options.steps[currentStepIndex];
            const baseColor = new Color(currentStep[1], currentStep[2], currentStep[3]);
            const nextStep = options.steps[(currentStepIndex + 1) % (options.steps.length)];
            const nextColor = new Color(nextStep[1], nextStep[2], nextStep[3]);
            let timeToReach = NaN;
            if (currentStepIndex === options.steps.length - 1) {
                timeToReach = (animationTime - currentStep[0]);
            } else {
                timeToReach = (nextStep[0] - currentStep[0]);
            }
            const stepStartedTime = currentStep[0];
            const currentTimeRelative = ((currentTime - animationStartedTime) % (animationTime));
            const percent = this.percentState(stepStartedTime, timeToReach, currentTimeRelative,
                                                currentStep[4] || 'linear');
            const currentColor = EffectBase.smooth(baseColor, nextColor, percent);
            leds.forEach((led) => {
                led.color = Color.clone(currentColor);
            });
        }
    }
}
