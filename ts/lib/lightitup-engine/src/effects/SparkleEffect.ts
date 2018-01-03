import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import EffectsUtils from "../EffectsUtils";

/**
 * Sparkle Effect
 */
export default class SparkleEffect extends EffectBase {

    static _name = 'sparkle';
    ledsCount: number;
    baseColor: Color;
    randomColors: boolean = false;
    arr = [];
    enabled = [];
    colors = [];
    minEnabledPercent;
    maxEnabledPercent;
    lastStep;
    stepTime;

    process(options: any, leds: Array<LED>, animationStartedTime: number,
            animationTime: number, currentTime: number): void {

      if (!this.initialized) {
        this.initialized = true;
        this.baseColor = new Color(options.baseColor[0], options.baseColor[1], options.baseColor[2]);
        this.randomColors = options.randomColors;
        this.ledsCount = leds.length;
        this.minEnabledPercent = options.minEnabledPercent / 100;
        this.maxEnabledPercent = Math.max(this.minEnabledPercent, options.maxEnabledPercent / 100);
        this.arr = [];
        this.colors = [];
        this.stepTime = options.stepTime;
        for(let i = 0; i < leds.length; i++){
          this.arr[i] = i;
          this.colors[i] = new Color(Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255));
        }
      }
      if(animationTime == 0){
        return;
      }

      const currentStep = Math.floor((currentTime - animationStartedTime) / this.stepTime);
      if(isNaN(this.lastStep) || this.lastStep != currentStep){
        this.lastStep = currentStep;
          this.switch(leds);
        }
        for (let i = 0; i < this.enabled.length; i++) {
          if (leds[this.enabled[i]].color == Color.Off) {
            leds[this.enabled[i]].color = this.randomColors ? this.getRandomColor() : this.baseColor;
          }
        }
    }

    private switch(leds){
      this.shuffle(this.arr);
      const percent = this.minEnabledPercent + (Math.random() * (this.maxEnabledPercent - this.minEnabledPercent));
      this.enabled = this.arr.slice(0, Math.ceil(percent*(this.ledsCount)));
      leds.forEach((led) => {
        led.color = Color.Off;
      });
    }

    private getRandomColor() {
      return this.colors[Math.floor(Math.random() * (this.colors.length- 1))];
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
