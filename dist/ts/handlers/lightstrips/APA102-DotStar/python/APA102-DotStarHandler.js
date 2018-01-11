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
 * A handler for DotStar Light Strips
 */
var PythonGenericHandler_1 = require("../../PythonGenericHandler");
var path = require('path');
var APA102_DotStarHandler = /** @class */ (function (_super) {
    __extends(APA102_DotStarHandler, _super);
    function APA102_DotStarHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scriptPath = path.resolve(__dirname, '../../../../../bin/py/handlers/lightstrips/APA102-DotStar');
        _this.scriptName = 'APA102-DotStar_handler.py';
        return _this;
    }
    APA102_DotStarHandler.driver_name = 'APA102-DotStar_Python_Driver';
    return APA102_DotStarHandler;
}(PythonGenericHandler_1.default));
exports.default = APA102_DotStarHandler;
//# sourceMappingURL=APA102-DotStarHandler.js.map