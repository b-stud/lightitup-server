import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import EffectsUtils from "../EffectsUtils";
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Fire effect
 * Reference: Adapted from tweaking4all, FastLed/Fire2012 by Mark Kriegsman
 * https://github.com/FastLED/FastLED/blob/master/examples/Fire2012/Fire2012.ino
 * https://www.tweaking4all.com/hardware/arduino/adruino-led-strip-effects/#cylon
 */
export default class FireEffect extends StepTimeAbstract {

  static _name = 'fire';
  ledsCount: number;
  cooling: number;
  sparking: number;
  space: number = NaN;
  reverse = false;
  baseColor: Color;
  heat: Array<number> = [];
  rainbow: boolean;
  bothSides: boolean;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.initialized = true;
      this.ledsCount = leds.length;
      this.cooling = options.cooling;
      this.sparking = options.sparking;
      this.stepTime = options.stepTime;
      this.bothSides = options.bothSides;
      this.resetStep();
      this.reverse = options.direction !== 'normal' ? true : false;
      for (let i = 0; i < this.ledsCount; i++) {
        this.heat[i] = 0;
        leds[i].color = Color.Off;
      }
    }

    if(this.stepCheck()) {
      // Step 4.  Convert heat to LED colors
      if(!this.bothSides) {
        for (let j = 0; j < this.ledsCount; j++) {
          this.setPixelHeatColor(leds, j, this.heat[j]);
        }
      } else {
        for (let j = 0; j < this.ledsCount / 2; j++) {
          this.setPixelHeatColor(leds, j, this.heat[j]);
          this.setPixelHeatColor(leds, this.ledsCount - 1 - j, this.heat[j]);
        }
      }
    }

  }

  private setPixelHeatColor(leds, Pixel: number, temperature: number) {
    if(this.reverse) {
      Pixel = this.ledsCount - 1 - Pixel;
    }
    // Scale 'heat' down from 0-255 to 0-191
    let t192 = Math.round((temperature / 255) * 191);
    // calculate ramp up from
    let heatramp = t192 & 0x3F; // 0..63
    heatramp = heatramp << 2; // scale up to 0..252
    // figure out which third of the spectrum we're in:
    if (t192 > 0x80) {                     // hottest
      leds[Pixel].color = new Color(255, 255, heatramp);
    } else if (t192 > 0x40) {             // middle
      leds[Pixel].color = new Color(255, heatramp, 0);
    } else {                               // coolest
      leds[Pixel].color = new Color(heatramp, 0, 0);
    }
  }

  public onStepChange(currentStep: number, delta: number): void {
    // Step 1.  Cool down every cell a little
    for (let i = 0; i < this.ledsCount; i++) {
      let cooldown = Math.random() * ( (this.cooling * 10 / this.ledsCount) + 2);
      if (cooldown > this.heat[i]) {
        this.heat[i] = 0;
      } else {
        this.heat[i] = this.heat[i] - cooldown;
      }
    }

    // Step 2.  Heat from each cell drifts 'up' and diffuses a little
    for (let k = this.ledsCount - 1; k >= 2; k--) {
      this.heat[k] = (this.heat[k - 1] + this.heat[k - 2] + this.heat[k - 2]) / 3;
    }

    // Step 3.  Randomly ignite new 'sparks' near the bottom
    if (Math.ceil(Math.random() * 255) < this.sparking) {
      let y = Math.ceil(Math.random() * 7);
      this.heat[y] = Math.ceil(Math.random() * (255 - 160) + 160);
      //this.heat[y] = random(160,255);
    }
  }


}
