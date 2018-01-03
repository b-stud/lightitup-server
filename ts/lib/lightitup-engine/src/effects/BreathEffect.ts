import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Simulates a Breath inspiration/expiration
 */
export default class BreathEffect extends StepTimeAbstract {

  static _name = 'breath';
  baseColor: any;
  currentColor: any;
  inspirationRatio: number;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {
    if (!this.initialized) {
      this.setEasingFn(options.easing);
      this.initialized = true;

      // Base color
      this.baseColor = Color.toHSL(new Color(options.basecolor[0], options.basecolor[1], options.basecolor[2]));
      this.currentColor = Color.toHSL(new Color(options.basecolor[0], options.basecolor[1],
        options.basecolor[2]));

      // How much percentage of the animation should the inspiration part take
      this.inspirationRatio = 0.01 * options.inspiration_ratio || 0.5;

      this.stepTime = options.stepTime;
      this.resetStep();
    }

    const now = new Date().getTime();
    this.stepCheck(now);

    const step = ((now - this.lastStepTime) / this.stepTime)%1;

    if (step > this.inspirationRatio) { // Expiration
      const val = this.percentState(this.lastStepTime + this.inspirationRatio * this.stepTime,
        (1 - this.inspirationRatio) * this.stepTime, now);
      this.currentColor.L = this.baseColor.L * (1 - val);
    } else { // Inspiration
      const val = this.percentState(this.lastStepTime, this.inspirationRatio * this.stepTime, now);
      this.currentColor.L = this.baseColor.L * val;
    }

    leds.forEach((led) => {
      led.color = Color.clone(Color.fromHSL(this.currentColor));
    });
  }


  public onStepChange(currentStep: number, delta: number): void {
  }

}
