import { isScrollAppearState } from './ScrollAppearState.js';
import {
	selectors,
	attributes,
} from './domMap.js';
import { ScrollAppearState } from './ScrollAppearState.js';

import { getQueue } from './queues.js';
import { ScrollAppearQueue } from './ScrollAppearQueue.js';

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
	#$queue: ScrollAppearQueue;
	#delay: number;

	constructor($element: Element) {
		if (scrollAppearItems.has($element)) {
			throw new Error('Cannot create a second `ScrollAppearItem` for the same `Element`');
		} else {
			scrollAppearItems.set($element, this);
		}

		this.#$element = $element;
		this.#$queue = this.#findQueue();
		this.#delay = Number($element.getAttribute(attributes.delay)) || 0;

		if (this.getState() === ScrollAppearState.UNINITIALISED) {
			this.#setState(ScrollAppearState.HIDDEN);
		}

		// Make this item appear as soon as it or any of its descendents receive focus
		this.#$element.addEventListener('focusin', () => this.appear(), { once: true });
	}

	get delay(): number {
		return this.#delay;
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

	/**
	 * Make an element appear
	 */
	appear(): void {
		if (this.getState() === ScrollAppearState.VISIBLE) {
			return;
		}

		if (matchMedia('(prefers-reduced-motion)').matches) {
			// Don't bother with the intermediate `APPEARING` state if the user prefers reduced motion
			this.#setState(ScrollAppearState.VISIBLE);
		} else {
			this.#setState(ScrollAppearState.APPEARING);

			if (getComputedStyle(this.#$element).transitionDuration !== '0s') {
				// If the `APPEARING` state has a transition duration, update the state when the transition ends
				this.#$element.addEventListener('transitionend', () => this.#setState(ScrollAppearState.VISIBLE), { once: true });
			} else {
				// Otherwise, update the state immediately
				this.#setState(ScrollAppearState.VISIBLE);
			}
		}
	}

	/**
	 * Update the DOM to reflect a new `ScrollAppearState`
	 */
	#setState(state: ScrollAppearState): void {
		this.#$element.setAttribute(attributes.state, state);
	}

	/**
	 * Query the DOM to retrieve the current `ScrollAppearState`
	 */
	getState(): ScrollAppearState {
		const state = this.#$element.getAttribute(attributes.state);

		if (isScrollAppearState(state)) {
			return state;
		} else {
			return ScrollAppearState.UNINITIALISED;
		}
	}

	/**
	 * Find an item's appropriate `ScrollAppearQueue`
	 */
	#findQueue(): ScrollAppearQueue {
		// First, check if the queue ID is specified via an attribute
		const queueId = this.#$element.getAttribute(attributes.queue);
		if (queueId) {
			return getQueue(queueId);
		}

		// Then, check if the item is inside a container
		const $container = this.#$element.closest(selectors.container);
		if ($container) {
			return getQueue($container);
		}

		// Otherwise, return the default queue
		return getQueue();
	}

	/**
	 * Find an item's appropriate queue and add it
	 */
	queue(): void {
		this.#$queue.push(this);
	}
}

// This pattern allows the type of `ScrollAppearItem` to be exported
// without also exporting its constructor
type ScrollAppearItemType = InstanceType<typeof ScrollAppearItem>;
export { ScrollAppearItemType as ScrollAppearItem };
