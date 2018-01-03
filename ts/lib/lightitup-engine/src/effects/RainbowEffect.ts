import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Animated or static Rainbow Effect
 */
export default class RainbowEffect extends StepTimeAbstract {

  static _name = 'rainbow';
  animated = true;
  offsetAngle = 0;
  angleCover = 360;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {
    if (!this.initialized) {
      this.setEasingFn(options.easing);
      this.stepTime = options.stepTime;
      this.resetStep();
      this.animated = options.animated;
      this.offsetAngle = options.offsetAngle;
      this.angleCover = options.angleCover;
      this.initialized = true;
    }

    const now = new Date().getTime();
    this.stepCheck(now);

    let angle: number = NaN;
    const len = leds.length;
    const phaseJump = (null != this.angleCover) ? this.angleCover / len : 360 / len;
    leds.forEach((led) => {

      if (this.animated) {
        angle = (Math.ceil(360 * this.percentState(this.lastStepTime, this.stepTime,
          now))
          + (this.offsetAngle || 0)) % 360;
        led.color = Color.fromHSL({
          H: Math.ceil((angle + Math.floor(led.id * phaseJump)) % 360) / 360,
          S: 1,
          L: 0.6
        });
      } else {
        angle = (this.offsetAngle || 0) % 360;
        led.color = Color.fromHSL({
          H: (angle + Math.floor(led.id * phaseJump)) / 360,
          S: 1,
          L: 0.6
        });
      }
    });
  }


  public onStepChange(currentStep: number, delta: number): void {
  }
}
