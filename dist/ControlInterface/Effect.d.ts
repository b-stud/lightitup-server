export default class Effect {
    id: number;
    name: string;
    config: string;
    timeLimit: number | null;
    priority: number | null;
    creationDate: number;
    static fromRow(row: any): Effect;
    setName(name: any): void;
    setConfig(config: any): void;
    setTimeLimit(timeLimit: any): void;
    setPriority(priority: any): void;
    setCreationDate(creationDate: any): void;
}
