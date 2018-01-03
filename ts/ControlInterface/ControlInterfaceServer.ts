import Scheduler from './Scheduler/Scheduler';
import Effect from './Effect';
import IndexAPI from '../index';

const fs = require('fs');
const express = require('express');
const path = require('path');
const db = require('better-sqlite3');
const thisPath = path.resolve(__dirname, '../../ControlInterfaceServer'); //Relative to dist
const dbName = thisPath+'/db/effects-database.db';
const createDBScript = thisPath+'/db/scripts/create.sql';
const lasteffectbackupfile = thisPath+'/db/lasteffect.json';
const routesPrefix = 'manager';

export default class ControlInterfaceServer {

    static database = null;
    static timer = 100;

    static checkNameExists(name: string): boolean {
        return (null !== ControlInterfaceServer.loadByName(name));
    }

    static createDb(): boolean {
        try {
            const database = new db(dbName);
            const query = fs.readFileSync(createDBScript, "utf8");
            database.exec(query);
            return true;
        }
        catch(e){
            console.error(e);
            return false;
        }
    }

    static init(app: any){
        app.use(express.static(thisPath +  '/web/'));
        let database =  null;
        try {
            database = new db(dbName, {
                fileMustExist: true
            });
        }
        catch(e){
            const creation = ControlInterfaceServer.createDb();
            if(!creation){
                return false;
            } else {
                database = new db(dbName, {
                    fileMustExist: true
                });
            }
        }
        // Database exists
        ControlInterfaceServer.database = database;
        ControlInterfaceServer.bindRoutes(app);
        Scheduler.init(app, ControlInterfaceServer.database);
    }

    static bindRoutes(app){
        app.get('/'+routesPrefix+'/list', (req, res) => ControlInterfaceServer.getAll(req, res));
        app.post('/'+routesPrefix, (req, res) => ControlInterfaceServer.createEffect(req, res));
        app.put('/'+routesPrefix+'/:id', (req, res) => ControlInterfaceServer.editEffect(req, res));
        app.delete('/'+routesPrefix+'/:id', (req, res) => ControlInterfaceServer.deleteEffect(req, res));
        app.post('/'+routesPrefix+'/apply/:name', (req, res) => ControlInterfaceServer.applyEffect(req, res));
    }

    static createEffect(req, res){
        let effect = null;
        try{
            const exists = ControlInterfaceServer.checkNameExists(req.body.name);
            if(exists){
                throw new Error('Name must be unique');
            }
            effect = ControlInterfaceServer.parseEffectRequest(req.body);
        }
        catch(e){
            return ControlInterfaceServer.createFailResponse(res, e.message || 'An error occurred');
        }
        ControlInterfaceServer.save(effect);
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    }

    static editEffect(req, res){
        let effect = null;
        if(!req.params.id || null === (effect = ControlInterfaceServer.loadById(req.params.id))) {
            return ControlInterfaceServer.createFailResponse(res, 'Could not update the effect');
        }
        try{
            const newEffect = ControlInterfaceServer.parseEffectRequest(req.body);
            newEffect.id = effect.id;
            ControlInterfaceServer.update(newEffect);
        }
        catch(e){
            return ControlInterfaceServer.createFailResponse(res, 'An error occurred');
        }
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    }


    static deleteEffect(req, res){
        let effect = null;
        if(!req.params.id || null === (effect = ControlInterfaceServer.loadById(req.params.id))) {
            ControlInterfaceServer.createFailResponse(res, 'Could not delete the effect');
        }
        ControlInterfaceServer.database.prepare("DELETE from effects WHERE id = ?")
            .run(req.params.id);
        return ControlInterfaceServer.createSuccessResponse(res, 'done');
    }

    private static parseEffectRequest(body: any): Effect | null {

        const effect = new Effect();

        // Check name
        const name = body.name;

        if(!name){
            throw new Error('Name cannot be empty');
        }

        // Check config
        let config = body.config;
        try{
            config = JSON.stringify(JSON.parse(config));
        }
        catch(e){
            throw new Error('Not a valid effect config');
        }

        // Check timeLimit
        let timeLimit = body.timeLimit;
        if(!timeLimit || isNaN(parseInt(timeLimit))) timeLimit = null;

        // Check priority
        let priority = body.priority;
        if(!priority || isNaN(parseInt(priority))) priority = null;

        // Check unique name, if does exist add
        effect.setName(name);
        effect.setConfig(config);
        effect.setTimeLimit(timeLimit);
        effect.setPriority(priority);
        effect.setCreationDate(new Date().getTime());


        return effect;
    }

    private static save(effect: Effect){
        ControlInterfaceServer.database.prepare("INSERT INTO effects (name, creation_time, config, timelimit, priority) VALUES (?, ?, ?, ?, ?)")
            .run(effect.name, effect.creationDate, effect.config, effect.timeLimit, effect.priority);
    }

    private static update(effect: Effect){
        ControlInterfaceServer.database.prepare("UPDATE effects SET name = ?, config = ?,  timelimit = ?, priority = ? WHERE id = ?")
            .run(effect.name, effect.config, effect.timeLimit, effect.priority, effect.id);
    }

    private static loadById(id: number): Effect|null{
        const data = ControlInterfaceServer.database.prepare("SELECT * FROM effects where id = ?").get(id);
        if(undefined == data) {
            return null;
        } else {
            return Effect.fromRow(data);
        }
    }

    private static loadByName(name: string): Effect|null{
        const data = ControlInterfaceServer.database.prepare("SELECT * FROM effects where name = ?").get(name);
        if(undefined == data) {
            return null;
        } else {
            return Effect.fromRow(data);
        }
    }

    static applyEffect(req, res){
        let effect = null;
        if(!req.params.name || null === (effect = ControlInterfaceServer.loadByName(req.params.name))) {
            return ControlInterfaceServer.createFailResponse(res, 'Could not load the effect');
        } else {
            let timeLimit = parseInt(effect.timeLimit);
            let priority = parseInt(effect.priority);
            if(req.query.priority){ // Priority overriding
                priority = parseInt(req.query.priority);
            }
            if(req.query.timeLimit){ // TimeLimit overriding
                timeLimit = parseInt(req.query.timeLimit);
            }
            IndexAPI.handleEffect(JSON.parse(effect.config), timeLimit, priority);
            return ControlInterfaceServer.createSuccessResponse(res, 'done');
        }
    }

    static applyEffectById(effectId: number){
        let effect = null;
        if(null === (effect = ControlInterfaceServer.loadById(effectId))) {
        } else {
            IndexAPI.handleEffect(JSON.parse(effect.config), parseInt(effect.timeLimit), parseInt(effect.priority));
        }
    }

    static getAll(req, res){
        const stmt = ControlInterfaceServer.database.prepare("SELECT * FROM effects ORDER BY name");
        const data = stmt.all();
        res.send(data || '[]');
    }

    static getLastEffect(){
        if(!fs.existsSync(lasteffectbackupfile)){
            return null;
        }
        try{
            const data =  JSON.parse(fs.readFileSync(lasteffectbackupfile, 'utf8'));
            return data;
        }
        catch(e){
            return null;
        }
    }

    static setLastEffect(config){
        fs.writeFileSync(lasteffectbackupfile, JSON.stringify(config));
    }

    static createFailResponse(res, message){
        return res.status(400).send({status: 'failed', message: message});
    }

    static createSuccessResponse(res, message){
        return res.status(200).send({status: 'success', message: message});
    }

    static close(){
        try{
            ControlInterfaceServer.database.close();
        }
        catch(e){}
    }

}