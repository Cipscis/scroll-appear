interface ScrollAppearQueueItem {
    $element: Element;
    delay: number;
}
export declare class ScrollAppearQueue {
    #private;
    constructor();
    items: ScrollAppearQueueItem[];
    timeout: ReturnType<typeof setTimeout> | null;
    /**
     * Add an item to the end of the queue if it's not in there already
     */
    push($element: Element): void;
    /**
     * Immediately show any elements that have left the viewport
     */
    catchUp(): void;
}
export {};
