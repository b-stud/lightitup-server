import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";


/**
 * Stack LEDs one by one
 */
export default class StackEffect extends StepTimeAbstract {

  static _name = 'stack';
  stackedColor: Color;        // 'Stacked' sate LED Color
  notStackedColor: Color;     // 'Not stacked' state Color
  stepsCount = NaN;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {
    const LEDSCount = leds.length;
    if (!this.initialized) {
      this.stackedColor = new Color(options.enabledColor[0], options.enabledColor[1],
        options.enabledColor[2]);
      this.notStackedColor = new Color(options.disabledColor[0], options.disabledColor[1],
        options.disabledColor[2]);
      this.stepTime = options.stepTime;
      this.resetStep();
      this.setEasingFn(options.easing);
      leds.forEach((led) => {
        led.color = this.notStackedColor;
      });
      if (!options.sameTourTime) {
        this.stepsCount = 0;
        for (let i = LEDSCount; i > 0; i--) {
          this.stepsCount += i;
        }
      }
      this.initialized = true;
    }

    const now = new Date().getTime();
    this.stepCheck(now);

    let enabledLEDS = NaN, currentLed = NaN;
    const currentSate = this.percentState(this.lastStepTime, this.stepTime, now);
    const currentStateLEDS = (LEDSCount * currentSate);

    if (options.sameTourTime) {

      enabledLEDS = Math.floor(currentStateLEDS);
      currentLed = Math.floor((LEDSCount - enabledLEDS) * (currentStateLEDS - enabledLEDS));

    } else {
      /*
      * *1.05 means we take a 5% security to ensure effect will run until all LEDs are enabled
      * Indeed, it can occur that refresh frequency is a way that prevent the script to reach the '1' percentState
      */
      const currentStep = Math.ceil(this.stepsCount * 1.05 * currentSate);
      let tmp = 0;
      enabledLEDS = 0;
      for (let i = LEDSCount; i >= 0; i--) {
        if (currentStep > i + tmp) {
          enabledLEDS++;
          tmp += i;
        } else {
          currentLed = currentStep - tmp - 1;
          break;
        }
      }
    }

    if (options.direction === 'reverse') {
      leds.forEach((led) => {
        if (led.id < enabledLEDS) {
          led.color = this.stackedColor;
        } else if (led.id === LEDSCount - currentLed) {
          led.color = this.stackedColor;
        } else {
          led.color = this.notStackedColor;
        }
      });
    } else {
      leds.forEach((led) => {
        if (led.id >= LEDSCount - enabledLEDS) {
          led.color = this.stackedColor;
        } else if (led.id === currentLed) {
          led.color = this.stackedColor;
        } else {
          led.color = this.notStackedColor;
        }
      });
    }
  }

  public onStepChange(currentStep: number, delta: number): void {
  }
}
