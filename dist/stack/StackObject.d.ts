/**
 * Represents an item inside the Stack class
 */
export default class StackPiece {
    id: string;
    object: any;
    priority: number;
    startedTime: number;
    constructor(id: string, object: any, priority: number, startedTime: number);
}
