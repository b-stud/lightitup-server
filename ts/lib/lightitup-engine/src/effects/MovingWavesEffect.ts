import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Moving Wave Effect
 *
 */
export default class MovingWavesEffect extends StepTimeAbstract {

  static _name = 'moving_waves';
  ledsCount: number;
  baseColor: Color;
  minColor: Color;
  waveSize;
  direction;
  colors: Array<Color>; // Fly weight design pattern
  colorLinks: Array<Color>;
  cursor;
  moveDirection;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
      this.minColor = new Color(Math.floor(0.2 * options.baseColor[0]), Math.floor(0.1 * options.baseColor[1]),
        Math.floor(0.1 * options.baseColor[2]));
      this.ledsCount = leds.length;
      this.stepTime = options.stepTime;
      this.resetStep();
      this.waveSize = Math.min(this.ledsCount - 1, options.waveSize);
      this.moveDirection = options.direction !== 'normal' ? -1 : 1;
      this.colors = [];
      this.colorLinks = [];
      this.cursor = 0;
      let distance = 0;
      let sign = 1;

      if (options.forceSmooth) {
        while (this.waveSize > 0
        && Math.round(leds.length / (2*this.waveSize)) !== leds.length / (2*this.waveSize)) {
          this.waveSize--;
        }
        if (leds.length / this.waveSize !== Math.round(leds.length / this.waveSize)) {
          this.waveSize = 0;
        }
      }

      for (let i = 0; i < this.ledsCount; i++) {
        if (!this.initialized || !this.colors[distance]) {
          const percent = Math.sin((Math.PI/2) * ((this.waveSize - distance + 1) / this.waveSize));
          this.colors[distance] = EffectBase.smooth(Color.Off, this.baseColor, percent)
        }
        this.colorLinks[i] = this.colors[distance];
        if (i % this.waveSize == 0 && i != 0) {
          sign *= -1;
        }
        distance = distance + sign * 1;
      }
      this.initialized = true;
    }

    if (this.stepCheck()) {
      for (let i = 0; i < this.ledsCount; i++) {
        leds[i].color = this.colorLinks[(this.cursor + i) % this.ledsCount];
      }
    }

  }

  public onStepChange(currentStep: number, delta: number): void {
    this.cursor = (this.cursor + this.moveDirection * delta) % this.ledsCount;
    if(this.cursor < 0) {
      this.cursor = this.ledsCount + this.cursor;
    }
  }

}
