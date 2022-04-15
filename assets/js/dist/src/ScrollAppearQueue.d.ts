import { ScrollAppearItem } from './ScrollAppearItem.js';
export declare class ScrollAppearQueue {
    #private;
    constructor();
    /**
     * Add a new item to the end of the queue if it's not in there already
     */
    push(item: ScrollAppearItem): void;
    /**
     * Immediately show any items that have left the viewport
     */
    catchUp(): void;
}
