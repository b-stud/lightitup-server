import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import EffectsUtils from "../EffectsUtils";
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Cylon Effect
 */
export default class CylonEffect extends StepTimeAbstract {

  static _name = 'cylon';
  ledsCount: number;
  baseColor: Color;
  scannerWidth: number = 0;
  breakTime: number = 100;
  headLimitPosition = 0;
  stepTime = 0;
  oneWayTime = 0;
  headMovingLength = 0;
  cursor = 0;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.initialized = true;
      this.setEasingFn(options.easing);
      this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
      this.scannerWidth = options.scannerWidth || 3;
      this.ledsCount = leds.length;
      this.breakTime = !isNaN(options.breakTime) ? options.breakTime : 500;
      this.stepTime = options.stepTime;
      this.resetStep();
      this.oneWayTime = (this.stepTime - 2 * this.breakTime) / 2;
      this.headLimitPosition = this.scannerWidth + 1;
      this.headMovingLength = leds.length - 2 * this.scannerWidth;
    }

    this.stepCheck();

    const now = new Date().getTime();
    const currentTimeRelative = now - this.lastStepTime;
    if (currentTimeRelative < this.oneWayTime) { // Go
      this.exec(leds, currentTimeRelative);
    } else if (currentTimeRelative < this.oneWayTime + this.breakTime) { // First break
    } else if (currentTimeRelative < 2 * this.oneWayTime + this.breakTime) { // Go back
      this.exec(leds, currentTimeRelative, true);
    } else {  // Second break
    }
  }


  exec(leds, currentTimeRelative, reverse = false) {
    let percent = NaN;
    if (!reverse) {
      percent = this.percentState(0, this.oneWayTime, currentTimeRelative);
    } else {
      percent = this.percentState(this.oneWayTime + this.breakTime, this.oneWayTime, currentTimeRelative);
    }
    leds.forEach((led) => {
      led.color = Color.Off;
    });
    let headPosition = this.headLimitPosition + Math.floor(percent * this.headMovingLength) - 1;
    if (reverse) {
      headPosition = leds.length - 1 - headPosition;
    }
    leds[headPosition].color = this.baseColor;
    for (let j = 1; j <= this.scannerWidth; j++) {
      const color = EffectBase.smooth(this.baseColor, Color.Off, j / this.scannerWidth);
      leds[headPosition + j].color = color;
      leds[headPosition - j].color = color;
    }
  }

  public onStepChange(currentStep: number, delta: number): void {
  }

}
