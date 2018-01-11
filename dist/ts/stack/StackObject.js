"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an item inside the Stack class
 */
var StackPiece = /** @class */ (function () {
    function StackPiece(id, object, priority, startedTime) {
        this.priority = 0; //Item priority (highest go to the stack's tail)
        this.startedTime = NaN; //Time on which the item has been added
        this.id = id;
        this.object = object;
        this.priority = priority;
        this.startedTime = startedTime;
    }
    return StackPiece;
}());
exports.default = StackPiece;
;
//# sourceMappingURL=StackObject.js.map