import ScheduledEvent from './ScheduledEvent';
import ControlInterfaceServer from '../ControlInterfaceServer';
import IndexAPI from '../../index';

const express = require('express');
const routesPrefix = 'scheduler';


export default class Scheduler {

    static database = null;
    static tableName = 'scheduled_events';
    static timer = null;

    static init(app: any, database: any) {
        Scheduler.database = database;Math.floor(0.001 * ((new Date().getTime()) % (60 * 1000)))
        Scheduler.bindRoutes(app);
        const currentSeconds = Math.floor(((new Date().getTime()) % (60 * 1000)) / 1000);
        setTimeout(() => {
            Scheduler.timer = setInterval(() => Scheduler.check(), 60 * 1000);
            Scheduler.check();
        }, 1000 * (60 - currentSeconds));
        Scheduler.check();
    }

    private static check() {
        const stmt = Scheduler.database.prepare("SELECT * FROM " + Scheduler.tableName + " ORDER BY id");
        const data = stmt.all();
        const events = [];
        data.forEach((currentData) => {
           events.push(ScheduledEvent.fromRow(currentData));
        });
        const weekDay = new Date().getDay() - 1;
        const date = new Date();
        let time = date.getUTCHours() * 60 + date.getUTCMinutes();
        const retainedEvents = events.filter((event) => { // Filter events that should be run now
            if(event.timeStart != time) {
                return false;
            }
            if(event.repeated){
               for(let i = 0; i < event.repeated.length; i++){
                   if(event.repeated[i] == weekDay){
                       return true;
                   }
               }
               return false;
           } else {
                return (event.weekDay == weekDay && event.timeStart == time);
           }
        });
        if (retainedEvents.length) {
            if(!isNaN(retainedEvents[0].effectId)){
                ControlInterfaceServer.applyEffectById(retainedEvents[0].effectId);
            } else {
                IndexAPI.reset();
            }
        }
    }

    private static bindRoutes(app) {
        app.get('/' + routesPrefix + '/list', (req, res) => Scheduler.getScheduledEvents(req, res));
        app.get('/' + routesPrefix + '/:id', (req, res) => Scheduler.getScheduledEvent(req, res));
        app.post('/' + routesPrefix, (req, res) => Scheduler.createNewScheduledEvent(req, res));
        app.put('/' + routesPrefix + '/:id', (req, res) => Scheduler.updateScheduledEvent(req, res));
        app.delete('/' + routesPrefix + '/:id', (req, res) => Scheduler.deleteScheduledEvent(req, res));
    }


    private static createFailResponse(res, message) {
        return res.status(400).send({status: 'failed', message: message});
    }

    private static createSuccessResponse(res, message) {
        return res.status(200).send({status: 'success', message: message});
    }

    public static getScheduledEvent(req, res) {
        if(!req.params.id){
            return this.createFailResponse(res,'');
        }
        try {
            const stmt = Scheduler.database.prepare("SELECT s.*, e.name as effectName FROM " + Scheduler.tableName +
                " s LEFT JOIN effects e ON e.id = s.effectId WHERE s.id = ?");
            const data = stmt.get(req.params.id);
            res.send(data);
        }
        catch(e){
            return this.createFailResponse(res, 'Could not the event');
        }
    }

    public static getScheduledEvents(req, res) {
        const stmt = Scheduler.database.prepare("SELECT s.*, e.name as effectName FROM " + Scheduler.tableName +
            " s LEFT JOIN effects e ON e.id = s.effectId ORDER BY id");
        const data = stmt.all();
        res.send(data || '[]');
    }

    public static createNewScheduledEvent(req, res) {
        try {
            const event = ScheduledEvent.fromRow(req.body);
            Scheduler.database.prepare("INSERT INTO " + Scheduler.tableName + " (config, effectId) VALUES (?, ?)")
                .run(event.getConfigToJsonString(), isNaN(event.effectId)?null:event.effectId);
            return Scheduler.createSuccessResponse(res, 'created');
        } catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    }

    public static updateScheduledEvent(req, res) {
        try {
            const event = Scheduler.loadById(req.params.id);
            const newEvent = ScheduledEvent.fromRow(req.body);
            if (!event) {
                throw '';
            }
            Scheduler.database.prepare("UPDATE " + Scheduler.tableName + " SET config = ?, effectId = ? where id = ?")
                .run(newEvent.getConfigToJsonString(), newEvent.effectId, event.getId());
            return Scheduler.createSuccessResponse(res, 'updated');
        } catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    }

    public static deleteScheduledEvent(req, res) {
        try {
            const event = Scheduler.loadById(req.params.id);
            if (!event) {
                throw '';
            }
            Scheduler.database.prepare("DELETE FROM " + Scheduler.tableName + " where id = ?")
                .run(event.getId());
            return Scheduler.createSuccessResponse(res, 'deleted');
        } catch (e) {
            Scheduler.createFailResponse(res, "Invalid data");
        }
    }

    private static loadById(id): ScheduledEvent | null {
        const data = Scheduler.database.prepare("SELECT * FROM " + this.tableName + " where id = ?").get(id);
        if (undefined == data) {
            return null;
        } else {
            return ScheduledEvent.fromRow(data);
        }
    }

}