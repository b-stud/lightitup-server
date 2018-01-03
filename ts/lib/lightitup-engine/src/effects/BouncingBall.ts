import EffectBase from '../EffectBase';
import LED from '../LED';
import Color from '../Color';

/**
 * Simulates one or more bouncing balls
 * Reference: This effect is adapted from 'Bouncing Ball' by Hans
 * https://www.tweaking4all.com/hardware/arduino/adruino-led-strip-effects/
 */
export default class BouncingBallEffect extends EffectBase {

  static _name = 'bouncing_ball';

  ledsCount: number;
  BallCount: number;
  Gravity: number;
  StartHeight: number;
  Height: Array<number>;
  ImpactVelocityStart: number;
  ImpactVelocity: Array<number>;
  TimeSinceLastBounce: Array<number>;
  Position: Array<number>;
  ClockTimeSinceLastBounce: Array<number>;
  Dampening: Array<number>;
  baseColor: Color;

  process(options: any, leds: Array<LED>, animationStartedTime: number,
          animationTime: number, currentTime: number): void {

    if (!this.initialized) {
      this.setEasingFn('linear');
      this.initialized = true;

      this.ledsCount = leds.length;
      this.BallCount = options.ballCount;
      this.Gravity = -9.81;
      this.StartHeight = 1;
      this.Height = []; //Size = BallCount
      this.ImpactVelocityStart = Math.sqrt( -2 * this.Gravity * this.StartHeight );
      this.ImpactVelocity = [];
      this.TimeSinceLastBounce = [];
      this.Position = [];
      this.ClockTimeSinceLastBounce = [];
      this.Dampening = [];
      this.baseColor = new Color(options.color[0], options.color[1], options.color[2]);

      for (let i = 0 ; i < this.BallCount ; i++) {
        this.ClockTimeSinceLastBounce[i] = currentTime;
        this.Height[i] = this.StartHeight;
        this.Position[i] = 0;
        this.ImpactVelocity[i] = this.ImpactVelocityStart;
        this.TimeSinceLastBounce[i] = 0;
        this.Dampening[i] = 0.90 - i/Math.pow(this.BallCount,2);
      }
    }

    for (let i = 0 ; i < this.BallCount ; i++) {
      this.TimeSinceLastBounce[i] =  currentTime - this.ClockTimeSinceLastBounce[i];
      this.Height[i] = 0.5 * this.Gravity * Math.pow( this.TimeSinceLastBounce[i]/1000 , 2.0 )
        + this.ImpactVelocity[i] * this.TimeSinceLastBounce[i]/1000;
      if ( this.Height[i] < 0 ) {
        this.Height[i] = 0;
        this.ImpactVelocity[i] = this.Dampening[i] * this.ImpactVelocity[i];
        this.ClockTimeSinceLastBounce[i] = currentTime;
        if ( this.ImpactVelocity[i] < 0.01 ) {
          this.ImpactVelocity[i] = this.ImpactVelocityStart;
        }
      }
      this.Position[i] = Math.round( this.Height[i] * (this.ledsCount - 1) / this.StartHeight);
    }
    for (let i = 0 ; i < this.ledsCount ; i++) {
      leds[i].color = Color.Off;
    }
    for (let i = 0 ; i < this.BallCount ; i++) {
      leds[this.Position[i]].color = this.baseColor;
    }

  }
}
