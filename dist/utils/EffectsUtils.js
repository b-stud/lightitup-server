"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utils class to deal with Effects
 */
var EffectsUtils = /** @class */ (function () {
    function EffectsUtils() {
    }
    /**
     * Will evaluate the duration of the effect or return NaN is the effect is to run forever (until another one overrides it)
     */
    EffectsUtils.evaluateEffectDuration = function (effectObj) {
        var max = NaN;
        effectObj.forEach(function (curEffectObj) {
            var options = curEffectObj.options;
            var delay = options.delay || 0;
            var duration = options.duration || 0;
            var waitAtEnd = options.waitAtEnd || 0;
            var repeat = options.repeat || NaN;
            if (!isNaN(repeat)) {
                max = Math.max(isNaN(max) ? -1 : max, repeat * (delay + duration + waitAtEnd));
            }
        });
        return isNaN(max) ? null : max;
    };
    ;
    return EffectsUtils;
}());
exports.default = EffectsUtils;
//# sourceMappingURL=EffectsUtils.js.map