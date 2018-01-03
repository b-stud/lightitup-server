import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import EffectsUtils from "../EffectsUtils";
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Twinkle Effect
 */
export default class TwinkleEffect extends StepTimeAbstract {

  static _name = 'twinkle';
  ledsCount: number;
  baseColor: Color;
  randomColors: boolean = false;
  arr = [];
  enabled = [];
  colors = [];
  minEnabledPercent;
  maxEnabledPercent;
  lastPercentState;
  stepsCount;
  lastSubStep;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.initialized = true;
      this.setEasingFn(options.easing);
      this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
      this.stepTime = options.stepTime;
      this.resetStep();
      this.randomColors = options.randomColors;
      this.ledsCount = leds.length;
      this.minEnabledPercent = options.minEnabledPercent / 100;
      this.maxEnabledPercent = Math.max(this.minEnabledPercent, options.maxEnabledPercent / 100);
      this.arr = [];
      this.colors = [];
      this.lastPercentState = NaN;
      for (let i = 0; i < leds.length; i++) {
        this.arr[i] = i;
        this.colors[i] = new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255));
      }

      this.stepsCount = Math.max(1, options.stepsCount);
      this.lastSubStep = NaN;
    }

    const now = new Date().getTime();

    if (this.stepCheck(now)) {
      this.switch(leds);
    }

    const currentSubStep = Math.floor(this.percentState(this.lastStepTime, this.stepTime, now) * this.stepsCount);

    if (isNaN(this.lastSubStep) || this.lastSubStep != currentSubStep || this.stepsCount == 1) {
      let percentState = ( 1 + currentSubStep ) / this.stepsCount;
      const limit = Math.ceil(percentState * this.enabled.length);
      for (let i = 0; i < limit; i++) {
        if (leds[this.enabled[i]].color == Color.Off) {
          leds[this.enabled[i]].color = this.randomColors ? this.getRandomColor() : this.baseColor;
        }
      }
      this.lastSubStep = currentSubStep;
    }
  }

  public onStepChange(currentStep: number, delta: number): void {
  }

  /**
   * Get another set
   * @param leds
   */
  private switch(leds) {
    this.shuffle(this.arr);
    const percent = this.minEnabledPercent + (Math.random() * (this.maxEnabledPercent - this.minEnabledPercent));
    this.enabled = this.arr.slice(0, Math.ceil(percent * (this.ledsCount)));
    leds.forEach((led) => {
      led.color = Color.Off;
    });
  }

  private getRandomColor() {
    return this.colors[Math.floor(Math.random() * (this.colors.length - 1))];
  }

  private shuffle(array) {
    let k = array.length;
    while (k > 0) {
      let i = Math.floor(Math.random() * k);
      k--;
      const temp = array[k];
      array[k] = array[i];
      array[i] = temp;
    }
    return array;
  }

}
