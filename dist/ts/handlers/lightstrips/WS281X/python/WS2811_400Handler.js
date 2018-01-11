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
 * A handler WS281X 400khz Light Strips
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var WS2811_400 = /** @class */ (function (_super) {
    __extends(WS2811_400, _super);
    function WS2811_400() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS281X');
        _this.scriptName = 'WS2811_400_handler.py';
        return _this;
    }
    WS2811_400.driver_name = 'WS2811_400_Python_Driver';
    return WS2811_400;
}(PythonGenericHandler_1.default));
exports.default = WS2811_400;
//# sourceMappingURL=WS2811_400Handler.js.map