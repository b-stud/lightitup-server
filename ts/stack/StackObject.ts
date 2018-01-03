/**
 * Represents an item inside the Stack class
 */
export default class StackPiece{
	id: string;                 //Item UID
	object: any;                //Item data
	priority: number = 0;       //Item priority (highest go to the stack's tail)
	startedTime: number = NaN;  //Time on which the item has been added
	
	constructor(id: string, object: any, priority: number, startedTime: number){
		this.id = id;
		this.object = object;
		this.priority = priority;
		this.startedTime = startedTime;
	}
};