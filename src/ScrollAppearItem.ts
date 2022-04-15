import {
	ScrollAppearState,
	isScrollAppearState,

	dataAttributes,
} from './constants.js';

import { isElementInViewport } from './viewport.js';

/**
 * This `Map` is used to store each `ScrollAppearItem` created against
 * the `Element` used to instantiate it, so we can ensure no `Element`
 * ever has more than one `ScrollAppearItem` created for it.
 */
const scrollAppearItems: Map<Element, ScrollAppearItem> = new Map();

/**
 * Create or retrieve a `ScrollAppearItem` for a specified `Element`.
 * This function should be used in place of the `ScrollAppearItem` constructor,
 * because this class uses a singleton-like pattern to ensure each `Element`
 * can only have a single `ScrollAppearItem` created for it.
 */
export function getScrollAppearItem($element: Element): ScrollAppearItem {
	return scrollAppearItems.get($element) || new ScrollAppearItem($element);
}

class ScrollAppearItem {
	#$element: Element;
	delay: number;

	constructor($element: Element) {
		if (scrollAppearItems.has($element)) {
			throw new Error('Cannot create a second `ScrollAppearItem` for the same `Element`');
		} else {
			scrollAppearItems.set($element, this);
		}

		this.#$element = $element;
		this.delay = Number($element.getAttribute(dataAttributes.delay)) || 0;

		if (this.getState() === ScrollAppearState.UNINITIALISED) {
			this.#setState(ScrollAppearState.HIDDEN);
		}
	}

	isInViewport(): boolean {
		return isElementInViewport(this.#$element);
	}

	appear(): void {
		this.#setState(ScrollAppearState.VISIBLE);
	}

	#setState(state: ScrollAppearState): void {
		this.#$element.setAttribute(dataAttributes.state, state);
	}

	getState(): ScrollAppearState {
		const state = this.#$element.getAttribute(dataAttributes.state);

		if (isScrollAppearState(state)) {
			return state;
		} else {
			return ScrollAppearState.UNINITIALISED;
		}
	}
}

// This pattern allows the type of `ScrollAppearItem` to be exported
// without also exporting its constructor
type ScrollAppearItemType = InstanceType<typeof ScrollAppearItem>;
export { ScrollAppearItemType as ScrollAppearItem };
