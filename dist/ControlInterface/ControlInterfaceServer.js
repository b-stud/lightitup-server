"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scheduler_1 = require("./Scheduler/Scheduler");
var Effect_1 = require("./Effect");
var index_1 = require("../index");
var fs = require('fs');
var express = require('express');
var path = require('path');
var db = require('better-sqlite3');
var thisPath = path.resolve(__dirname, '../../ControlInterfaceServer'); //Relative to dist
var dbName = thisPath + '/db/effects-database.db';
var createDBScript = thisPath + '/db/scripts/create.sql';
var lasteffectbackupfile = thisPath + '/db/lasteffect.json';
var routesPrefix = 'manager';
var ControlInterfaceServer = /** @class */ (function () {
    function ControlInterfaceServer() {
    }
    ControlInterfaceServer.checkNameExists = function (name) {
        return (null !== ControlInterfaceServer.loadByName(name));
    };
    ControlInterfaceServer.createDb = function () {
        try {
            var database = new db(dbName);
            var query = fs.readFileSync(createDBScript, "utf8");
            database.exec(query);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    };
    ControlInterfaceServer.init = function (app) {
        app.use(express.static(thisPath + '/web/'));
        var database = null;
        try {
            database = new db(dbName, {
                fileMustExist: true
            });
        }
        catch (e) {
            var creation = ControlInterfaceServer.createDb();
            if (!creation) {
                return false;
            }
            else {
                database = new db(dbName, {
                    fileMustExist: true
                });
            }
        }
        // Database exists
        ControlInterfaceServer.database = database;
        ControlInterfaceServer.bindRoutes(app);
        Scheduler_1.default.init(app, ControlInterfaceServer.database);
    };
    ControlInterfaceServer.bindRoutes = function (app) {
        app.get('/' + routesPrefix + '/list', function (req, res) { return ControlInterfaceServer.getAll(req, res); });
        app.post('/' + routesPrefix, function (req, res) { return ControlInterfaceServer.createEffect(req, res); });
        app.put('/' + routesPrefix + '/:id', function (req, res) { return ControlInterfaceServer.editEffect(req, res); });
        app.delete('/' + routesPrefix + '/:id', function (req, res) { return ControlInterfaceServer.deleteEffect(req, res); });
        app.post('/' + routesPrefix + '/apply/:name', function (req, res) { return ControlInterfaceServer.applyEffect(req, res); });
    };
    ControlInterfaceServer.createEffect = function (req, res) {
        var effect = null;
        try {
            var exists = ControlInterfaceServer.checkNameExists(req.body.name);
            if (exists) {
                throw new Error('Name must be unique');
            }
            effect = ControlInterfaceServer.parseEffectRequest(req.body);
        }
        catch (e) {
            return ControlInterfaceServer.createFailResponse(res, e.message || 'An error occurred');
        }
        ControlInterfaceServer.save(effect);
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    };
    ControlInterfaceServer.editEffect = function (req, res) {
        var effect = null;
        if (!req.params.id || null === (effect = ControlInterfaceServer.loadById(req.params.id))) {
            return ControlInterfaceServer.createFailResponse(res, 'Could not update the effect');
        }
        try {
            var newEffect = ControlInterfaceServer.parseEffectRequest(req.body);
            newEffect.id = effect.id;
            ControlInterfaceServer.update(newEffect);
        }
        catch (e) {
            return ControlInterfaceServer.createFailResponse(res, 'An error occurred');
        }
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    };
    ControlInterfaceServer.deleteEffect = function (req, res) {
        var effect = null;
        if (!req.params.id || null === (effect = ControlInterfaceServer.loadById(req.params.id))) {
            ControlInterfaceServer.createFailResponse(res, 'Could not delete the effect');
        }
        ControlInterfaceServer.database.prepare("DELETE from effects WHERE id = ?")
            .run(req.params.id);
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    };
    ControlInterfaceServer.parseEffectRequest = function (body) {
        var effect = new Effect_1.default();
        // Check name
        var name = body.name;
        if (!name) {
            throw new Error('Name cannot be empty');
        }
        // Check config
        var config = body.config;
        try {
            config = JSON.stringify(JSON.parse(config));
        }
        catch (e) {
            throw new Error('Not a valid effect config');
        }
        // Check timeLimit
        var timeLimit = body.timeLimit;
        if (!timeLimit || isNaN(parseInt(timeLimit)))
            timeLimit = null;
        // Check priority
        var priority = body.priority;
        if (!priority || isNaN(parseInt(priority)))
            priority = null;
        // Check unique name, if does exist add
        effect.setName(name);
        effect.setConfig(config);
        effect.setTimeLimit(timeLimit);
        effect.setPriority(priority);
        effect.setCreationDate(new Date().getTime());
        return effect;
    };
    ControlInterfaceServer.save = function (effect) {
        ControlInterfaceServer.database.prepare("INSERT INTO effects (name, creation_time, config, timelimit, priority) VALUES (?, ?, ?, ?, ?)")
            .run(effect.name, effect.creationDate, effect.config, effect.timeLimit, effect.priority);
    };
    ControlInterfaceServer.update = function (effect) {
        ControlInterfaceServer.database.prepare("UPDATE effects SET name = ?, config = ?,  timelimit = ?, priority = ? WHERE id = ?")
            .run(effect.name, effect.config, effect.timeLimit, effect.priority, effect.id);
    };
    ControlInterfaceServer.loadById = function (id) {
        var data = ControlInterfaceServer.database.prepare("SELECT * FROM effects where id = ?").get(id);
        if (undefined == data) {
            return null;
        }
        else {
            return Effect_1.default.fromRow(data);
        }
    };
    ControlInterfaceServer.loadByName = function (name) {
        var data = ControlInterfaceServer.database.prepare("SELECT * FROM effects where name = ?").get(name);
        if (undefined == data) {
            return null;
        }
        else {
            return Effect_1.default.fromRow(data);
        }
    };
    ControlInterfaceServer.applyEffect = function (req, res) {
        var effect = null;
        if (!req.params.name || null === (effect = ControlInterfaceServer.loadByName(req.params.name))) {
            return ControlInterfaceServer.createFailResponse(res, 'Could not load the effect');
        }
        else {
            var timeLimit = parseInt(effect.timeLimit);
            var priority = parseInt(effect.priority);
            if (req.query.priority) {
                priority = parseInt(req.query.priority);
            }
            if (req.query.timeLimit) {
                timeLimit = parseInt(req.query.timeLimit);
            }
            index_1.default.handleEffect(JSON.parse(effect.config), timeLimit, priority);
            return ControlInterfaceServer.createSuccessResponse(res, 'done');
        }
    };
    ControlInterfaceServer.applyEffectById = function (effectId) {
        var effect = null;
        if (null === (effect = ControlInterfaceServer.loadById(effectId))) {
        }
        else {
            index_1.default.handleEffect(JSON.parse(effect.config), parseInt(effect.timeLimit), parseInt(effect.priority));
        }
    };
    ControlInterfaceServer.getAll = function (req, res) {
        var stmt = ControlInterfaceServer.database.prepare("SELECT * FROM effects ORDER BY name");
        var data = stmt.all();
        res.send(data || '[]');
    };
    ControlInterfaceServer.getLastEffect = function () {
        if (!fs.existsSync(lasteffectbackupfile)) {
            return null;
        }
        try {
            var data = JSON.parse(fs.readFileSync(lasteffectbackupfile, 'utf8'));
            return data;
        }
        catch (e) {
            return null;
        }
    };
    ControlInterfaceServer.setLastEffect = function (config) {
        fs.writeFileSync(lasteffectbackupfile, JSON.stringify(config));
    };
    ControlInterfaceServer.createFailResponse = function (res, message) {
        return res.status(400).send({ status: 'failed', message: message });
    };
    ControlInterfaceServer.createSuccessResponse = function (res, message) {
        return res.status(200).send({ status: 'success', message: message });
    };
    ControlInterfaceServer.close = function () {
        try {
            ControlInterfaceServer.database.close();
        }
        catch (e) { }
    };
    ControlInterfaceServer.database = null;
    ControlInterfaceServer.timer = 100;
    return ControlInterfaceServer;
}());
exports.default = ControlInterfaceServer;
//# sourceMappingURL=ControlInterfaceServer.js.map