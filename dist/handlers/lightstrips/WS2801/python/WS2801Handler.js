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
 * A handler the WS2801 Light Strip
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var WS2801Handler = /** @class */ (function (_super) {
    __extends(WS2801Handler, _super);
    function WS2801Handler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS2801');
        _this.scriptName = 'WS2801_handler.py';
        return _this;
    }
    WS2801Handler.driver_name = 'WS2801_Python_Driver';
    return WS2801Handler;
}(PythonGenericHandler_1.default));
exports.default = WS2801Handler;
//# sourceMappingURL=WS2801Handler.js.map