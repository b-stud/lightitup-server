"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StackObject_1 = require("./StackObject");
/**
 * A stack representation class
 */
var Stack = /** @class */ (function () {
    function Stack() {
        this.stack = [];
    }
    /**
     * Clear all items
     */
    Stack.prototype.reset = function () {
        this.stack = [];
    };
    /**
     * Add an item depending on its priority
     * @param {string} id            Item UID
     * @param object                 Item Data
     * @param {number} priority      Item priority
     * @param {number} startedTime   Pushing time
     * @returns {StackPiece}
     */
    Stack.prototype.push = function (id, object, priority, startedTime) {
        //Look for index on which to put the StackPiece
        var index = NaN;
        for (var i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i].priority <= priority) {
                index = i + 1;
                break;
            }
        }
        var obj = new StackObject_1.default(id, object, priority, startedTime);
        if (!isNaN(index))
            this.stack.splice(index, 0, obj);
        else
            this.stack.unshift(obj);
        return this.getLast();
    };
    /**
     * Remove an item from the stack
     * @param {string} id   Item UID
     */
    Stack.prototype.remove = function (id) {
        var _this = this;
        this.stack.forEach(function (stackPiece, index) {
            if (stackPiece.id == id) {
                _this.stack.splice(index, 1);
                return;
            }
        });
    };
    /**
     * Get the last effect of the stack
     * @returns {StackPiece}
     */
    Stack.prototype.getLast = function () {
        return this.stack.length ? this.stack[this.stack.length - 1] : null;
    };
    Stack.prototype.isLast = function (id) {
        return this.getLast().id == id;
    };
    return Stack;
}());
exports.default = Stack;
;
//# sourceMappingURL=Stack.js.map