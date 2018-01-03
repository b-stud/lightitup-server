import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import EffectsUtils from "../EffectsUtils";
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Color Wipe Effect
 */
export default class ColorWipeEffect extends StepTimeAbstract {

  static _name = 'color_wipe';
  ledsCount: number;
  cursor: number;
  moveDirection;
  colors: Array<Color>; // Fly weight design pattern
  colorLinks: Array<Color> = [];

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.initialized = true;
      this.colors = [];
      options.colors.forEach((color) => {
        this.colors.push(new Color(color[0], color[1], color[2]));
      });
      this.ledsCount = leds.length;
      this.moveDirection = options.direction !== 'normal' ? 1 : -1;
      this.cursor = 0;
      this.stepTime = options.stepTime;
      this.resetStep();

      for (let i = 0; i < this.colors.length; i++) {
        for (let j = 0; j < this.ledsCount; j++) {
          this.colorLinks[i * this.ledsCount + j] = this.colors[i];
        }
      }
    }

    if(this.stepCheck()) {
      for (let i = 0; i < this.ledsCount; i++) {
        leds[i].color = this.colorLinks[(this.cursor + i) % (this.ledsCount * this.colors.length)];
      }
    }
  }

  public onStepChange(currentStep: number, delta: number): void {
    this.cursor = (this.cursor + this.moveDirection * delta) % (this.ledsCount * this.colors.length);
    if (this.cursor < 0) {
      this.cursor = (this.ledsCount * this.colors.length) + this.cursor;
    }
  }


}
