import { isScrollAppearState } from './ScrollAppearState.js';
import { attributes } from './domMap.js';
import { ScrollAppearState } from './ScrollAppearState.js';

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
		this.delay = Number($element.getAttribute(attributes.delay)) || 0;

		if (this.getState() === ScrollAppearState.UNINITIALISED) {
			this.#setState(ScrollAppearState.HIDDEN);
		}

		// Make this item appear as soon as it or any of its descendents receive focus
		this.#$element.addEventListener('focusin', () => this.appear(), { once: true });
	}

	/**
	 * Checks if a `ScrollAppearItem`'s `Element` is in the viewport.
	 * Only checks vertical boundaries, not horizontal.
	 */
	isInViewport(threshold: number = 0): boolean {
		const windowHeight = window.innerHeight;
		const maxThreshold = (windowHeight / 2) - 50;
		if (threshold > maxThreshold) {
			threshold = maxThreshold;
		}

		const coords = this.#$element.getBoundingClientRect();

		const viewportHeight = window.innerHeight || document.documentElement.clientWidth;
		const viewportTop = threshold;
		const viewportBottom = viewportHeight - threshold;

		// Is the bottom of the element below the top of the viewport?
		const belowTop = coords.bottom >= viewportTop;

		// Is the top of the element above the bottom of the viewport?
		const aboveBottom = coords.top <= viewportBottom;

		const inViewport = belowTop && aboveBottom;

		return inViewport;
	}

	appear(): void {
		this.#setState(ScrollAppearState.VISIBLE);
	}

	#setState(state: ScrollAppearState): void {
		this.#$element.setAttribute(attributes.state, state);
	}

	getState(): ScrollAppearState {
		const state = this.#$element.getAttribute(attributes.state);

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
