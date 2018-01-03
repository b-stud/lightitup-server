import Point from './Point';

/**
 * Some useful methods shared by all the effects
 */
export default class EffectsUtils {

    // Different well known easing & bezier functions to compute effects proggress state regarding to the current time
    static Easing: any = {
        cubicBezierBase: (y1: number, y2: number, t: number): number => (
            +(3 * y1 * t * Math.pow((1 - t), 2)) + (3 * y2 * t * t * (1 - t)) + t * t * t),
        cubicBezier: (p1: Point, p2: Point, t: number): number => EffectsUtils.Easing.cubicBezierBase(p1.y, p2.y, t),
        linear: (t: number): number => t,
        easeInQuad: (t: number): number => t * t,
        easeOutQuad: (t: number): number => t * (2 - t),
        easeInOutQuad: (t: number): number => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: (t: number): number => t * t * t,
        easeOutCubic: (t: number): number => (--t) * t * t + 1,
        easeInOutCubic: (t: number): number => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: (t: number): number => t * t * t * t,
        easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,
        easeInOutQuart: (t: number): number => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: (t: number): number => t * t * t * t * t,
        easeOutQuint: (t: number): number => 1 + (--t) * t * t * t * t,
        easeInOutQuint: (t: number): number => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        random: (t: number): number => Math.random(),
    };

}
