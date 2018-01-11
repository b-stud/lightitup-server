"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScheduledEvent = /** @class */ (function () {
    function ScheduledEvent(timeStart, effectId, weekDay, repeated, id) {
        if (weekDay === void 0) { weekDay = NaN; }
        if (repeated === void 0) { repeated = null; }
        if (id === void 0) { id = NaN; }
        this.timeStart = timeStart;
        this.effectId = effectId;
        this.weekDay = weekDay;
        this.repeated = repeated;
        this.id = id;
    }
    ScheduledEvent.prototype.setId = function (id) {
        this.id = id;
    };
    ScheduledEvent.prototype.isRepeated = function () {
        return (this.repeated && this.repeated.length) ? true : false;
    };
    ScheduledEvent.prototype.isOneTime = function () {
        return !this.isRepeated() && !isNaN(this.weekDay);
    };
    ScheduledEvent.prototype.getId = function () {
        return this.id;
    };
    ScheduledEvent.prototype.getConfigToJsonString = function () {
        var config = {};
        config.timeStart = this.timeStart;
        config.weekDay = this.weekDay;
        config.repeated = this.repeated;
        return JSON.stringify(config);
    };
    /**
     * From database return
     * @param data  database response
     * @returns {ScheduledEvent}
     */
    ScheduledEvent.fromRow = function (data) {
        var config = JSON.parse(data.config);
        var timeStart = parseInt(config.timeStart);
        var effectId = parseInt(data.effectId);
        var weekDay = (!isNaN(config.weekDay)) ? parseInt(config.weekDay) : NaN;
        var repeated = config.repeated || null;
        var id = data.id ? parseInt(data.id) : NaN;
        return new ScheduledEvent(timeStart, effectId, weekDay, repeated, id);
    };
    return ScheduledEvent;
}());
exports.default = ScheduledEvent;
//# sourceMappingURL=ScheduledEvent.js.map