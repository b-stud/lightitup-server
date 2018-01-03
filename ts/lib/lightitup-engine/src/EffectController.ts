import Led from './LED';
import EffectConfig from './EffectConfig';
import EffectBase from './EffectBase';
import BreathEffect from './effects/BreathEffect';
import SimpleColorEffect from './effects/SimpleColorEffect';
import StepperEffect from './effects/StepperEffect';
import RainbowEffect from './effects/RainbowEffect';
import StackEffect from './effects/StackEffect';
import TrailsEffect from './effects/TrailsEffect';
import ExplodeEffect from './effects/ExplodeEffect';
import RandomColorEffect from './effects/RandomColorEffect';
import ShineEffect from './effects/ShineEffect';
import CandleEffect from './effects/CandleEffect';
import AudioEffect from './effects/AudioEffect';
import BouncingBallEffect from "./effects/BouncingBallEffect";
import KnightRiderEffect from "./effects/KnightRiderEffect";
import TwinkleEffect from "./effects/TwinkleEffect";
import SparkleEffect from "./effects/SparkleEffect";
import MovingWavesEffect from "./effects/MovingWavesEffect";
import ColorWipeEffect from "./effects/ColorWipeEffect";
import TheaterChaseEffect from "./effects/TheaterChaseEffect";
import FireEffect from "./effects/FireEffect";

const effects: any = {};
effects[BreathEffect._name] = BreathEffect;
effects[SimpleColorEffect._name] = SimpleColorEffect;
effects[RandomColorEffect._name] = RandomColorEffect;
effects[StepperEffect._name] = StepperEffect;
effects[RainbowEffect._name] = RainbowEffect;
effects[StackEffect._name] = StackEffect;
effects[TrailsEffect._name] = TrailsEffect;
effects[ExplodeEffect._name] = ExplodeEffect;
effects[ShineEffect._name] = ShineEffect;
effects[CandleEffect._name] = CandleEffect;
effects[AudioEffect._name] = AudioEffect;
effects[BouncingBallEffect._name] = BouncingBallEffect;
effects[KnightRiderEffect._name] = KnightRiderEffect;
effects[TwinkleEffect._name] = TwinkleEffect;
effects[SparkleEffect._name] = SparkleEffect;
effects[MovingWavesEffect._name] = MovingWavesEffect;
effects[ColorWipeEffect._name] = ColorWipeEffect;
effects[TheaterChaseEffect._name] = TheaterChaseEffect;
effects[FireEffect._name] = FireEffect;

/**
 * Effects handler class
 */
export default class EffectController {

    /**
     * Apply an effect to the LEDs set
     * @param {Array<LED>} LEDs
     * @param {EffectConfig} effect
     * @param {number} animationStartedTime
     * @param {number} animationTime
     * @param {number} currentTime
     */
    static applyEffect(LEDs: Array<Led>, effect: EffectConfig, animationStartedTime: number,
                       animationTime: number, currentTime: number): void {
        if (null == effect.instance) {
            effect.instance = new effects[effect.name]();
        }
        return ((<EffectBase>effect.instance).process)(effect.options, LEDs, animationStartedTime,
            animationTime, currentTime);
    }

}
