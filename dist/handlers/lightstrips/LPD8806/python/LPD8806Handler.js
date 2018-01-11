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
 * A handler the LPD8806 Light Strip
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var LPD8806Handler = /** @class */ (function (_super) {
    __extends(LPD8806Handler, _super);
    function LPD8806Handler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/LPD8806');
        _this.scriptName = 'LPD8806_handler.py';
        return _this;
    }
    LPD8806Handler.driver_name = 'LPD8806_Python_Driver';
    return LPD8806Handler;
}(PythonGenericHandler_1.default));
exports.default = LPD8806Handler;
//# sourceMappingURL=LPD8806Handler.js.map