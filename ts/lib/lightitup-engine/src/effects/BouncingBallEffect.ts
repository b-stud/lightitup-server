import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';
import StepTimeAbstract from "./utils/StepTimeAbstract";

/**
 * Simulates one or more bouncing balls
 * Reference: This effect is adapted from 'Bouncing Ball' by Hans
 * https://www.tweaking4all.com/hardware/arduino/adruino-led-strip-effects/
 */
export default class BouncingBallEffect extends StepTimeAbstract {

  static _name = 'bouncing_ball';

  ledsCount: number;
  BallCount: number;
  Gravity: number;
  StartHeight: number;
  Height: Array<number>;
  ImpactVelocityStart: number;
  ImpactVelocity: Array<number>;
  ImpactVelocityLimit: number;
  TimeSinceLastBounce: Array<number>;
  Position: Array<number>;
  ClockTimeSinceLastBounce: Array<number>;
  Dampening: Array<number>;
  baseColor: Color;
  randomColors: boolean;
  colors: Array<Color> = [Color.Blue, Color.Red, Color.Yellow, Color.Green, Color.Pink, Color.Purple, Color.Orange];
  colorLinks: Array<Color> = [];
  trails: boolean = false;
  reverse: boolean = false;
  trailsLength: number = 5;
  tracker: Array<number> = [];

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.setEasingFn('linear');
      this.initialized = true;


      this.ledsCount = leds.length;
      this.BallCount = options.ballCount;
      this.trails = options.trails;
      this.trailsLength = Math.max(0, options.trailsLength);
      this.reverse = options.direction !== 'normal';
      this.randomColors = options.randomColors;
      this.Gravity = options.gravity || -9.81;
      this.ImpactVelocityLimit = 1 / this.ledsCount;
      this.StartHeight = options.startHeight / 100;
      this.Height = []; //Size = BallCount
      this.ImpactVelocityStart = Math.sqrt(-2 * this.Gravity * this.StartHeight);
      this.ImpactVelocity = [];
      this.TimeSinceLastBounce = [];
      this.Position = [];
      this.ClockTimeSinceLastBounce = [];
      this.Dampening = [];
      this.tracker = [];
      if (!this.randomColors) {
        this.baseColor = new Color(options.color[0], options.color[1], options.color[2]);
      }

      for (let i = 0; i < this.BallCount; i++) {
        this.ClockTimeSinceLastBounce[i] = 0;
        this.Height[i] = this.StartHeight;
        this.Position[i] = 0;
        this.ImpactVelocity[i] = this.ImpactVelocityStart;
        this.TimeSinceLastBounce[i] = 0;
        this.Dampening[i] = (1 - options.dampening / 100) - i / Math.pow(this.BallCount, 2);
        this.colorLinks[i] = this.colors[Math.floor(Math.random() * this.colors.length)];
      }

      const k = (Math.log(this.ImpactVelocityLimit / this.ImpactVelocityStart)) / Math.log(this.Dampening[0]);
      this.stepTime = animationTime / Math.ceil(k);
      this.resetStep();
    }

    if (this.stepCheck()) {
      for (let i = 0; i < this.ledsCount; i++) {
        leds[i].color = Color.Off;
      }
      for (let i = 0; i < this.BallCount; i++) {

        let color = this.randomColors ? this.colorLinks[i] : this.baseColor;
        let index = this.reverse ? this.ledsCount - 1 - this.Position[i] : this.Position[i];

        if (this.trails) {

          if (isNaN(this.tracker[i])) {
            this.tracker[i] = index;
          }
          else {
            let currentMovingDirection = Math.sign(index - this.tracker[i]);
            this.tracker[i] = index;
            let opacityFactor = this.ImpactVelocity[i] / this.ImpactVelocityStart;
            for (let j = 0; j < this.trailsLength; j++) {
              let k = index - currentMovingDirection*j;
              if (k >= 0 && k < this.ledsCount) {
                leds[k].color
                  = this.trail(color, j, this.trailsLength, Math.sin(Math.PI/2 * Math.pow(opacityFactor, 3)));
              }
            }
          }
        }
        leds[index].color = color;
      }
    }

  }

  public onStepChange(currentStep: number, delta: number): void {
    const currentTime = new Date().getTime();
    for (let i = 0; i < this.BallCount; i++) {

      this.TimeSinceLastBounce[i] = currentTime - this.ClockTimeSinceLastBounce[i];

      this.Height[i] = 0.5 * this.Gravity * Math.pow(this.TimeSinceLastBounce[i] / 1000, 2.0)
        + this.ImpactVelocity[i] * this.TimeSinceLastBounce[i] / 1000;

      if (this.Height[i] < 0) {
        this.Height[i] = 0;
        this.ImpactVelocity[i] *= this.Dampening[i];
        this.ClockTimeSinceLastBounce[i] = currentTime;
        if (this.ImpactVelocity[i] < this.ImpactVelocityLimit) {
          this.ImpactVelocity[i] = this.ImpactVelocityStart;
        }
      }

      this.Position[i] = Math.round(this.Height[i] * (this.ledsCount - 1) / this.StartHeight);
    }
  }

  private trail(base: Color, distance: number, trailsLength: number = 5, opacityFactor = 1) {
    if (distance > trailsLength) {
      return Color.Off;
    } else return new Color(
      Math.floor(base.R * opacityFactor * (1 - distance / trailsLength)),
      Math.floor(base.G * opacityFactor * (1 - distance / trailsLength)),
      Math.floor(base.B * opacityFactor * (1 - distance / trailsLength)),
    );
  }

}
