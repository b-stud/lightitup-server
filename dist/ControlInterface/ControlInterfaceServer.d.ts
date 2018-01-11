export default class ControlInterfaceServer {
    static database: any;
    static timer: number;
    static checkNameExists(name: string): boolean;
    static createDb(): boolean;
    static init(app: any): boolean;
    static bindRoutes(app: any): void;
    static createEffect(req: any, res: any): any;
    static editEffect(req: any, res: any): any;
    static deleteEffect(req: any, res: any): any;
    private static parseEffectRequest(body);
    private static save(effect);
    private static update(effect);
    private static loadById(id);
    private static loadByName(name);
    static applyEffect(req: any, res: any): any;
    static applyEffectById(effectId: number): void;
    static getAll(req: any, res: any): void;
    static getLastEffect(): any;
    static setLastEffect(config: any): void;
    static createFailResponse(res: any, message: any): any;
    static createSuccessResponse(res: any, message: any): any;
    static close(): void;
}
