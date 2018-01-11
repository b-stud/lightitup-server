"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScheduledEvent_1 = require("./ScheduledEvent");
var ControlInterfaceServer_1 = require("../ControlInterfaceServer");
var index_1 = require("../../index");
var express = require('express');
var routesPrefix = 'scheduler';
var Scheduler = /** @class */ (function () {
    function Scheduler() {
    }
    Scheduler.init = function (app, database) {
        Scheduler.database = database;
        Math.floor(0.001 * ((new Date().getTime()) % (60 * 1000)));
        Scheduler.bindRoutes(app);
        var currentSeconds = Math.floor(((new Date().getTime()) % (60 * 1000)) / 1000);
        setTimeout(function () {
            Scheduler.timer = setInterval(function () { return Scheduler.check(); }, 60 * 1000);
            Scheduler.check();
        }, 1000 * (60 - currentSeconds));
        Scheduler.check();
    };
    Scheduler.check = function () {
        var stmt = Scheduler.database.prepare("SELECT * FROM " + Scheduler.tableName + " ORDER BY id");
        var data = stmt.all();
        var events = [];
        data.forEach(function (currentData) {
            events.push(ScheduledEvent_1.default.fromRow(currentData));
        });
        var weekDay = new Date().getDay() - 1;
        var date = new Date();
        var time = date.getUTCHours() * 60 + date.getUTCMinutes();
        var retainedEvents = events.filter(function (event) {
            if (event.timeStart != time) {
                return false;
            }
            if (event.repeated) {
                for (var i = 0; i < event.repeated.length; i++) {
                    if (event.repeated[i] == weekDay) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return (event.weekDay == weekDay && event.timeStart == time);
            }
        });
        if (retainedEvents.length) {
            if (!isNaN(retainedEvents[0].effectId)) {
                ControlInterfaceServer_1.default.applyEffectById(retainedEvents[0].effectId);
            }
            else {
                index_1.default.reset();
            }
        }
    };
    Scheduler.bindRoutes = function (app) {
        app.get('/' + routesPrefix + '/list', function (req, res) { return Scheduler.getScheduledEvents(req, res); });
        app.get('/' + routesPrefix + '/:id', function (req, res) { return Scheduler.getScheduledEvent(req, res); });
        app.post('/' + routesPrefix, function (req, res) { return Scheduler.createNewScheduledEvent(req, res); });
        app.put('/' + routesPrefix + '/:id', function (req, res) { return Scheduler.updateScheduledEvent(req, res); });
        app.delete('/' + routesPrefix + '/:id', function (req, res) { return Scheduler.deleteScheduledEvent(req, res); });
    };
    Scheduler.createFailResponse = function (res, message) {
        return res.status(400).send({ status: 'failed', message: message });
    };
    Scheduler.createSuccessResponse = function (res, message) {
        return res.status(200).send({ status: 'success', message: message });
    };
    Scheduler.getScheduledEvent = function (req, res) {
        if (!req.params.id) {
            return this.createFailResponse(res, '');
        }
        try {
            var stmt = Scheduler.database.prepare("SELECT s.*, e.name as effectName FROM " + Scheduler.tableName +
                " s LEFT JOIN effects e ON e.id = s.effectId WHERE s.id = ?");
            var data = stmt.get(req.params.id);
            res.send(data);
        }
        catch (e) {
            return this.createFailResponse(res, 'Could not the event');
        }
    };
    Scheduler.getScheduledEvents = function (req, res) {
        var stmt = Scheduler.database.prepare("SELECT s.*, e.name as effectName FROM " + Scheduler.tableName +
            " s LEFT JOIN effects e ON e.id = s.effectId ORDER BY id");
        var data = stmt.all();
        res.send(data || '[]');
    };
    Scheduler.createNewScheduledEvent = function (req, res) {
        try {
            var event_1 = ScheduledEvent_1.default.fromRow(req.body);
            Scheduler.database.prepare("INSERT INTO " + Scheduler.tableName + " (config, effectId) VALUES (?, ?)")
                .run(event_1.getConfigToJsonString(), isNaN(event_1.effectId) ? null : event_1.effectId);
            return Scheduler.createSuccessResponse(res, 'created');
        }
        catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    };
    Scheduler.updateScheduledEvent = function (req, res) {
        try {
            var event_2 = Scheduler.loadById(req.params.id);
            var newEvent = ScheduledEvent_1.default.fromRow(req.body);
            if (!event_2) {
                throw '';
            }
            Scheduler.database.prepare("UPDATE " + Scheduler.tableName + " SET config = ?, effectId = ? where id = ?")
                .run(newEvent.getConfigToJsonString(), newEvent.effectId, event_2.getId());
            return Scheduler.createSuccessResponse(res, 'updated');
        }
        catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    };
    Scheduler.deleteScheduledEvent = function (req, res) {
        try {
            var event_3 = Scheduler.loadById(req.params.id);
            if (!event_3) {
                throw '';
            }
            Scheduler.database.prepare("DELETE FROM " + Scheduler.tableName + " where id = ?")
                .run(event_3.getId());
            return Scheduler.createSuccessResponse(res, 'deleted');
        }
        catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    };
    Scheduler.loadById = function (id) {
        var data = Scheduler.database.prepare("SELECT * FROM " + this.tableName + " where id = ?").get(id);
        if (undefined == data) {
            return null;
        }
        else {
            return ScheduledEvent_1.default.fromRow(data);
        }
    };
    Scheduler.database = null;
    Scheduler.tableName = 'scheduled_events';
    Scheduler.timer = null;
    return Scheduler;
}());
exports.default = Scheduler;
//# sourceMappingURL=Scheduler.js.map