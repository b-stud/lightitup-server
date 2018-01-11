export default class Scheduler {
    static database: any;
    static tableName: string;
    static timer: any;
    static init(app: any, database: any): void;
    private static check();
    private static bindRoutes(app);
    private static createFailResponse(res, message);
    private static createSuccessResponse(res, message);
    static getScheduledEvent(req: any, res: any): any;
    static getScheduledEvents(req: any, res: any): void;
    static createNewScheduledEvent(req: any, res: any): any;
    static updateScheduledEvent(req: any, res: any): any;
    static deleteScheduledEvent(req: any, res: any): any;
    private static loadById(id);
}
