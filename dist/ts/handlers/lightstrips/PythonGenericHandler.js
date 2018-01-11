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
/**
 * A generic wrapper for Python handlers
 */
var LightStripHandlerAbstract_1 = require("./LightStripHandlerAbstract");
var PythonShell = require('python-shell');
var WS281XHandler = /** @class */ (function (_super) {
    __extends(WS281XHandler, _super);
    function WS281XHandler() {
        var _this = _super.call(this) || this;
        _this.initialized = false;
        _this.offArray = [];
        _this.shell = null;
        _this.LEDsCount = 0;
        _this.scriptName = '';
        _this.scriptPath = '';
        return _this;
    }
    WS281XHandler.prototype.init = function (LEDsCount, opts) {
        if (opts === void 0) { opts = {}; }
        this.LEDsCount = LEDsCount;
        _super.prototype.init.call(this, LEDsCount, opts);
        for (var i = 0; i < this.LEDsCount; i++) {
            this.offArray.push([0, 0, 0]);
        }
        try {
            this.shell = new PythonShell(this.scriptName, {
                mode: 'json',
                pythonPath: 'python',
                pythonOptions: ['-u'],
                scriptPath: this.scriptPath,
                args: [
                    LEDsCount,
                    opts.SPI.DEVICE,
                    opts.SPI.PORT,
                    opts.SPI.CLK_PIN,
                    opts.SPI.DATA_PIN
                ]
            });
            this.initialized = true;
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    WS281XHandler.prototype.open = function () {
        return this;
    };
    WS281XHandler.prototype.isOpened = function () {
        return this.initialized;
    };
    WS281XHandler.prototype.close = function () {
        if (this.isOpened()) {
            try {
                this.clear();
                this.shell.childProcess.kill();
                this.shell = null;
                this.initialized = false;
            }
            catch (e) {
            }
        }
        return this;
    };
    WS281XHandler.prototype.update = function (colorsArray) {
        if (this.isOpened()) {
            this.shell.send(LightStripHandlerAbstract_1.default.adjust(colorsArray));
        }
        return this;
    };
    WS281XHandler.prototype.clear = function () {
        this.update(this.offArray);
        return this;
    };
    return WS281XHandler;
}(LightStripHandlerAbstract_1.default));
exports.default = WS281XHandler;
//# sourceMappingURL=PythonGenericHandler.js.map