import { ScrollAppearState } from './constants.js';
/**
 * Create or retrieve a `ScrollAppearItem` for a specified `Element`.
 * This function should be used in place of the `ScrollAppearItem` constructor,
 * because this class uses a singleton-like pattern to ensure each `Element`
 * can only have a single `ScrollAppearItem` created for it.
 */
export declare function getScrollAppearItem($element: Element): ScrollAppearItem;
declare class ScrollAppearItem {
    #private;
    delay: number;
    constructor($element: Element);
    isInViewport(): boolean;
    appear(): void;
    getState(): ScrollAppearState;
}
declare type ScrollAppearItemType = InstanceType<typeof ScrollAppearItem>;
export { ScrollAppearItemType as ScrollAppearItem };
