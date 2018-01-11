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
 * A handler the P9813 Light Strip
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var P9813Handler = /** @class */ (function (_super) {
    __extends(P9813Handler, _super);
    function P9813Handler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/P9813');
        _this.scriptName = 'P9813_handler.py';
        return _this;
    }
    P9813Handler.driver_name = 'P9813_Python_Driver';
    return P9813Handler;
}(PythonGenericHandler_1.default));
exports.default = P9813Handler;
//# sourceMappingURL=P9813Handler.js.map