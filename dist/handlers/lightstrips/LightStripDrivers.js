"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WS2801Handler_1 = require("../lightstrips/WS2801/python/WS2801Handler");
var WS281XHandler_1 = require("./WS281X/python/WS281XHandler");
var WS2811_400Handler_1 = require("./WS281X/python/WS2811_400Handler");
var APA102_DotStarHandler_1 = require("./APA102-DotStar/python/APA102-DotStarHandler");
var LPD8806Handler_1 = require("./LPD8806/python/LPD8806Handler");
var P9813Handler_1 = require("./P9813/python/P9813Handler");
/**
 * Light strips Drivers wrapper
 */
var LightStripDrivers = /** @class */ (function () {
    function LightStripDrivers() {
    }
    LightStripDrivers.load = function (driver) {
        switch (driver) {
            case WS2801Handler_1.default.driver_name:
                return new WS2801Handler_1.default();
            case WS281XHandler_1.default.driver_name:
                return new WS281XHandler_1.default();
            case WS2811_400Handler_1.default.driver_name:
                return new WS2811_400Handler_1.default();
            case APA102_DotStarHandler_1.default.driver_name:
                return new APA102_DotStarHandler_1.default();
            case LPD8806Handler_1.default.driver_name:
                return new LPD8806Handler_1.default();
            case P9813Handler_1.default.driver_name:
                return new P9813Handler_1.default();
        }
    };
    return LightStripDrivers;
}());
exports.default = LightStripDrivers;
//# sourceMappingURL=LightStripDrivers.js.map