import StackPiece from './StackObject';

/**
 * A stack representation class
 */
export default class Stack{

	stack: Array<any> = [];
	maxStackSize = null;

	constructor(maxStackSize: number = null){
	    if(null != maxStackSize){
	        this.maxStackSize = Math.max(1, maxStackSize);
        }
	}

    /**
     * Clear all items
     */
	reset(): void{
		this.stack = [];
	}

    /**
     * Add an item depending on its priority
     * @param {string} id            Item UID
     * @param object                 Item Data
     * @param {number} priority      Item priority
     * @param {number} startedTime   Pushing time
     * @returns {StackPiece}
     */
	push(id: string, object: any, priority: number, startedTime: number): StackPiece{
		//Look for index on which to put the StackPiece
		let index = NaN;
		for(let i = this.stack.length - 1; i >= 0; i--){
			if(this.stack[i].priority <= priority){
				index = i+1;
				break;
			}
		}
		let obj = new StackPiece(id, object, priority, startedTime);
		if(!isNaN(index)) this.stack.splice(index, 0, obj);
		else this.stack.unshift(obj);

		if (null != this.maxStackSize && this.stack.length >= this.maxStackSize) {
		    this.stack.shift();
        }

        return this.getLast();
	}

    /**
     * Remove an item from the stack
     * @param {string} id   Item UID
     */
	remove(id: string): void{
		this.stack.forEach((stackPiece, index) => {
			if(stackPiece.id == id){
				this.stack.splice(index, 1);
				return;
			}
		});
	}

    /**
     * Get the last effect of the stack
     * @returns {StackPiece}
     */
	getLast(): StackPiece|null {
		return this.stack.length?this.stack[this.stack.length - 1]:null;
	}

    isLast(id: string): boolean{
        return this.getLast().id == id;
    }

};