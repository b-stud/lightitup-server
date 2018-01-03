import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Simulate trails
 */
export default class TrailsEffect extends StepTimeAbstract {

  static _name = 'trails';
  frequency: number = NaN;         // Trails frequency
  attenuation: number = NaN;       // Light attenuation percent depending on the distance to leading head
  baseColor: Color;                // Base color
  trailsColor: Color;                // Trails color
  baseLuminosity: number = NaN;    // Trails color luminosity
  head = 0;                        // Leading LED position
  firstCycleAchieved = false;      // Has the first cycle done
  lastPercent: number = NaN;       // Needed to set the firstCycleAchieved
  maxTrailLength: number = 0;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {
    if (!this.initialized) {
      if (options.attenuation) {
        const minAttenuation = 100 / leds.length, maxAttenuation = 100;
        this.attenuation = 0.01 * Math.max(minAttenuation, Math.min(maxAttenuation, options.attenuation));
      }
      this.stepTime = options.stepTime || 2000;
      this.resetStep();

      this.frequency = Math.max(1, options.frequency || 0);

      if (options.adjustFrequency) {
        while (this.frequency > 0
        && Math.round(leds.length / this.frequency) !== leds.length / this.frequency) {
          this.frequency--;
        }
        if (leds.length / this.frequency !== Math.round(leds.length / this.frequency)) {
          this.frequency = 0;
        }
      }

      this.maxTrailLength = options.maxTrailLength;

      this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
      this.trailsColor = new Color(options.trailsColor[0], options.trailsColor[1], options.trailsColor[2]);
      this.setEasingFn(options.easing);
      this.initialized = true;
    }

    const now = new Date().getTime();
    this.stepCheck(now);
    const percent = this.percentState(this.lastStepTime, this.stepTime, now);

    if (!this.firstCycleAchieved && !isNaN(this.lastPercent) && this.lastPercent > percent) {
      this.firstCycleAchieved = true;
    } else {
      this.lastPercent = percent;
    }

    this.head = Math.round(percent * (leds.length - 1));

    leds.forEach((led) => {
      let distance = NaN;
      if (options.direction === 'reverse') {
        distance = ((this.head) + led.id) % this.frequency;
      } else {
        distance = (this.head - led.id) % this.frequency;
      }
      if (distance < 0) {
        distance += this.frequency;
      }
      if (Math.abs(distance) >= options.maxTrailLength) {
        led.color = this.baseColor;
      } else {
        led.color = EffectBase.smooth(this.baseColor, this.trailsColor,
          Math.max(0, 1 - Math.abs(distance) * this.attenuation));
      }
    });
  }


  public onStepChange(currentStep: number, delta: number): void {
  }
}
