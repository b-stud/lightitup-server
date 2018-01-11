import StackPiece from './StackObject';
/**
 * A stack representation class
 */
export default class Stack {
    stack: Array<any>;
    /**
     * Clear all items
     */
    reset(): void;
    /**
     * Add an item depending on its priority
     * @param {string} id            Item UID
     * @param object                 Item Data
     * @param {number} priority      Item priority
     * @param {number} startedTime   Pushing time
     * @returns {StackPiece}
     */
    push(id: string, object: any, priority: number, startedTime: number): StackPiece;
    /**
     * Remove an item from the stack
     * @param {string} id   Item UID
     */
    remove(id: string): void;
    /**
     * Get the last effect of the stack
     * @returns {StackPiece}
     */
    getLast(): StackPiece | null;
    isLast(id: string): boolean;
}
