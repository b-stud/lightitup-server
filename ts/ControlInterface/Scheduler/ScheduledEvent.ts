export default class ScheduledEvent {

    constructor(public timeStart: number, public effectId: number, public weekDay: number = NaN,
                public repeated: Array<number> = null, private id = NaN) {
    }

    private setId(id: number){
        this.id = id;
    }

    public isRepeated(): boolean {
        return (this.repeated && this.repeated.length) ? true : false;
    }

    public isOneTime(): boolean {
        return !this.isRepeated() && !isNaN(this.weekDay);
    }

    public getId() {
        return this.id;
    }

    public getConfigToJsonString(){
        let config: any  = {};
        config.timeStart = this.timeStart;
        config.weekDay = this.weekDay;
        config.repeated = this.repeated;
        return JSON.stringify(config);
    }
    /**
     * From database return
     * @param data  database response
     * @returns {ScheduledEvent}
     */
    static fromRow(data){
        const config = JSON.parse(data.config);
        const timeStart = parseInt(config.timeStart);
        const effectId = parseInt(data.effectId);
        const weekDay  = (!isNaN(config.weekDay))?parseInt(config.weekDay):NaN;
        const repeated = config.repeated || null;
        const id = data.id?parseInt(data.id):NaN;
        return new ScheduledEvent(timeStart, effectId, weekDay, repeated, id);
    }
}