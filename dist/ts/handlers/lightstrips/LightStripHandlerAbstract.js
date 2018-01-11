"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Abstract class  (Dependency Injection Pattern)
*/
var LightStripHandlerAbstract = /** @class */ (function () {
    function LightStripHandlerAbstract() {
    }
    /**
     * Adjust gamma levels, should be called before updating LEDs
     * @param {Array<Array<number>>} colorsArray
     * @returns {Array<Array<number>>} Adjusted levels colors array
     */
    LightStripHandlerAbstract.adjust = function (colorsArray) {
        for (var i = 0; i < colorsArray.length; i++) {
            colorsArray[i][0] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][0]];
            colorsArray[i][2] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][2]];
            colorsArray[i][1] = LightStripHandlerAbstract.gammaCorrectionTable[colorsArray[i][1]];
        }
        return colorsArray;
    };
    ;
    /**
     * Initialize the handler
     * @param {number} LEDsCount Number of leds
     * @param opts
     * @returns {LightStripHandlerAbstract}
     */
    LightStripHandlerAbstract.prototype.init = function (LEDsCount, opts) {
        if (opts === void 0) { opts = {}; }
        for (var i = 0; i < 256; i++) {
            LightStripHandlerAbstract.gammaCorrectionTable[i] = Math.round(255 * Math.pow(i / 255, opts.gamma || LightStripHandlerAbstract.defaultGamma));
        }
        return this;
    };
    LightStripHandlerAbstract.defaultGamma = 2.5;
    LightStripHandlerAbstract.gammaCorrectionTable = new Array(256);
    return LightStripHandlerAbstract;
}());
exports.default = LightStripHandlerAbstract;
//# sourceMappingURL=LightStripHandlerAbstract.js.map