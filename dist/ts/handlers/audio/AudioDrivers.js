"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PythonAudioDeviceHandler_1 = require("./python/PythonAudioDeviceHandler");
/**
 * Audio Drivers wrapper
 */
var AudioStripDrivers = /** @class */ (function () {
    function AudioStripDrivers() {
    }
    AudioStripDrivers.load = function (driver) {
        switch (driver) {
            case PythonAudioDeviceHandler_1.default.driver_name:
                return new PythonAudioDeviceHandler_1.default();
        }
    };
    return AudioStripDrivers;
}());
exports.default = AudioStripDrivers;
//# sourceMappingURL=AudioDrivers.js.map