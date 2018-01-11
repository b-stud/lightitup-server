"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Effect = /** @class */ (function () {
    function Effect() {
    }
    Effect.fromRow = function (row) {
        var effect = new Effect();
        effect.id = row.id || null;
        effect.name = row.name;
        effect.config = row.config;
        effect.timeLimit = row.timeLimit;
        effect.priority = row.priority;
        effect.creationDate = row.creationDate;
        return effect;
    };
    Effect.prototype.setName = function (name) {
        this.name = name;
    };
    Effect.prototype.setConfig = function (config) {
        this.config = config;
    };
    Effect.prototype.setTimeLimit = function (timeLimit) {
        this.timeLimit = timeLimit;
    };
    Effect.prototype.setPriority = function (priority) {
        this.priority = priority;
    };
    Effect.prototype.setCreationDate = function (creationDate) {
        this.creationDate = creationDate;
    };
    return Effect;
}());
exports.default = Effect;
//# sourceMappingURL=Effect.js.map