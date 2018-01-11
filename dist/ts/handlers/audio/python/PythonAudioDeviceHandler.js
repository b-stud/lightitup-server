"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AudioDeviceHandlerAbstract_1 = require("../AudioDeviceHandlerAbstract");
var PythonShell = require('python-shell');
var path = require('path');
var PythonAudioDeviceHandler = /** @class */ (function (_super) {
    __extends(PythonAudioDeviceHandler, _super);
    function PythonAudioDeviceHandler() {
        var _this = _super.call(this) || this;
        _this.shell = null;
        return _this;
    }
    PythonAudioDeviceHandler.prototype.startListening = function (deviceIndex, latency, opts, callback) {
        this.shell = new PythonShell('analyzer.py', {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.resolve(__dirname, '../../../../bin/py/audio'),
            args: [deviceIndex, latency, opts.frequencyBand[0], opts.frequencyBand[1]]
        });
        this.shell.on('message', function (message) {
            callback(message);
        });
    };
    PythonAudioDeviceHandler.prototype.stopListening = function () {
        if (this.shell) {
            this.shell.childProcess.kill();
            this.shell = null;
        }
    };
    PythonAudioDeviceHandler.driver_name = 'Python_Audio_Driver';
    return PythonAudioDeviceHandler;
}(AudioDeviceHandlerAbstract_1.default));
exports.default = PythonAudioDeviceHandler;
//# sourceMappingURL=PythonAudioDeviceHandler.js.map