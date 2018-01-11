export default class ScheduledEvent {
    timeStart: number;
    effectId: number;
    weekDay: number;
    repeated: Array<number>;
    private id;
    constructor(timeStart: number, effectId: number, weekDay?: number, repeated?: Array<number>, id?: number);
    private setId(id);
    isRepeated(): boolean;
    isOneTime(): boolean;
    getId(): number;
    getConfigToJsonString(): string;
    /**
     * From database return
     * @param data  database response
     * @returns {ScheduledEvent}
     */
    static fromRow(data: any): ScheduledEvent;
}
