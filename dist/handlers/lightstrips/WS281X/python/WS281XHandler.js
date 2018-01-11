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
 * A handler WS281X Light Strips
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var WS281XHandler = /** @class */ (function (_super) {
    __extends(WS281XHandler, _super);
    function WS281XHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/WS281X');
        _this.scriptName = 'WS281X_handler.py';
        return _this;
    }
    WS281XHandler.driver_name = 'WS281X_Python_Driver';
    return WS281XHandler;
}(PythonGenericHandler_1.default));
exports.default = WS281XHandler;
//# sourceMappingURL=WS281XHandler.js.map