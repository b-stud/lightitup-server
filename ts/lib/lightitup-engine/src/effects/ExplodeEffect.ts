import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Simulates an explosion (fusing particles)
 */
export default class ExplodeEffect extends StepTimeAbstract {

  static _name = 'explode';
  static stepPrecision = 1000;    // 1000 to make visible when lifetime is far away from animation duration
  baseColor: Color;               // Particles color
  baseLuminosity: number = NaN;   // Particles color base luminosity
  middle: Array<number>;          // Middle LED ID (one if odd, 2 if even)
  stepsCount: number = NaN;       // Steps count needed to achieve the whole animation
  stepTime: number = NaN;         // Time between each step
  currentSubStep: number = NaN;   // Current Sub step
  attenuation: number = NaN;      // How much attenuating luminosity depending on the distance to the middle LED
  maxTrailLength: number = NaN;   // Cut the trail after X LEDs

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {
    if (!this.initialized) {
      this.middle = ((leds.length % 2) !== 0) ? [(leds.length - 1) / 2] : [leds.length/2 - 1, leds.length/2];
      this.stepsCount = Math.ceil(ExplodeEffect.stepPrecision * options.lifetime / animationTime);
      this.stepTime = options.stepTime;
      this.resetStep();
      this.attenuation = 0.01 * options.attenuation || 0.12;
      this.maxTrailLength = options.maxTrailLength || 8;
      this.setEasingFn(options.easing);
      this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
      this.baseLuminosity = Color.toHSL(this.baseColor).L;
      this.initialized = true;
    }

    const now = new Date().getTime();
    this.stepCheck(now);

    this.currentSubStep = Math.floor(ExplodeEffect.stepPrecision *
        ((now - this.lastStepTime) % this.stepTime ) / this.stepTime);

    const distance = Math.floor((this.currentSubStep / ExplodeEffect.stepPrecision)
      * (leds.length - 1 - (this.middle[1] || this.middle[0])));
    const id1 = Math.max(0, this.middle[0] - distance);
    const id2 = Math.min(leds.length - 1, (this.middle[1] || this.middle[0]) + distance);

    let iterationLuminosity = Math.max(0, this.baseLuminosity * (1 - this.currentSubStep / this.stepsCount));
    iterationLuminosity = iterationLuminosity * (1 - Math.sin(Math.PI/2 * this.currentSubStep / options.lifetime));

    leds.forEach((led, index) => {
      let luminosity = 0;
      if (index === id1 || index === id2) {
        luminosity = iterationLuminosity;
      } else if (index < id2 && index > id1) {
        let dist = NaN;
        if (index < id2 && id2 - index < index - id1) {
          dist = id2 - index;
        } else {
          dist = index - id1;
        }
        if (dist > 0 && dist < this.maxTrailLength) {
          luminosity = Math.max(0, iterationLuminosity * (1 - dist * this.attenuation));
        } else {
          luminosity = 0;
        }
      }
      const color = Color.toHSL(this.baseColor);
      color.L = luminosity;
      led.color = Color.fromHSL(color);
    });
  }

  public onStepChange(currentStep: number, delta: number): void {
  }
}
