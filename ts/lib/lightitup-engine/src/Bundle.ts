import * as LIU_Engine from './LightItUpEngineCore';

/**
 * Entry point for 'NOT Typescript' environments usage
 */
export default class LightItUpEngine {
    static Color = LIU_Engine.Color;
    static EffectBase = LIU_Engine.EffectBase;
    static EffectConfig = LIU_Engine.EffectConfig;
    static EffectController = LIU_Engine.EffectController;
    static LED = LIU_Engine.LED;
    static LEDAnimator = LIU_Engine.LEDAnimator;
    static LEDController = LIU_Engine.LEDController;
    static EffectsAPI_JSON = LIU_Engine.EffectsAPI_JSON;
    static AudioEffect = LIU_Engine.AudioEffect;
    static Effects = {
        AudioEffect: LIU_Engine.AudioEffect,
        BouncingBallEffect: LIU_Engine.BouncingBallEffect,
        BreathEffect: LIU_Engine.BreathEffect,
        CandleEffect: LIU_Engine.CandleEffect,
        ColorWipeEffect: LIU_Engine.ColorWipeEffect,
        KnightRiderEffect: LIU_Engine.KnightRiderEffect,
        ExplodeEffect: LIU_Engine.ExplodeEffect,
        FireEffect: LIU_Engine.FireEffect,
        MovingWavesEffect: LIU_Engine.MovingWavesEffect,
        RainbowEffect: LIU_Engine.RainbowEffect,
        RandomColorEffect: LIU_Engine.RandomColorEffect,
        ShineEffect: LIU_Engine.ShineEffect,
        SimpleColorEffect: LIU_Engine.SimpleColorEffect,
        SparkleEffect: LIU_Engine.SparkleEffect,
        StackEffect: LIU_Engine.StackEffect,
        StepperEffect: LIU_Engine.StepperEffect,
        TheaterChaseEffect: LIU_Engine.TheaterChaseEffect,
        TrailsEffect: LIU_Engine.TrailsEffect,
        TwinkleEffect: LIU_Engine.TwinkleEffect,
    };
}
