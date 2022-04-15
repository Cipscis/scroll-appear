import { throttleWithDebounce } from '@cipscis/throttle-with-debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

import { selectors } from './domMap.js';
import { ScrollAppearState } from './ScrollAppearState.js';

import { getScrollAppearItem } from './ScrollAppearItem.js';
import { getAllQueues } from './queues.js';

// TODO: Improve initialisation/default styles so there is never an initial flash, without compromising no-js functionality
// TODO: Detect when new elements are added to the page and initialise them if necessary

/** (milliseconds) Throttle/debounce delay for scroll and resize events */
const delay = 100;

/**
 * Initialise ScrollAppear items and functionality
 */
function init(): void {
	_queueElementsInViewport();
	_initEvents();
}

/**
 * Show elements in the viewport any time the viewport changes through
 * scrolling or resizing.
 */
function _initEvents(): void {
	const passiveOptions = passiveSupported ? { passive: true } : true;

	const throttledShow = throttleWithDebounce(_queueElementsInViewport, delay);

	window.addEventListener('scroll', throttledShow, passiveOptions);
	window.addEventListener('resize', throttledShow, passiveOptions);

	const throttledCatchUp = throttleWithDebounce(_catchUpQueue, delay);

	window.addEventListener('scroll', throttledCatchUp, passiveOptions);
	window.addEventListener('resize', throttledCatchUp, passiveOptions);
}

/**
 * Add all hidden elements in the viewport to the relevant queue
 * As a side effect, this also initialises all elements
 */
function _queueElementsInViewport(): void {
	const $elements = Array.from(document.querySelectorAll(selectors.item));
	const items = $elements.map(getScrollAppearItem);
	const hiddenItems = items.filter((item) => item.getState() === ScrollAppearState.HIDDEN);

	const hiddenItemsInViewport = hiddenItems.filter((item) => item.isInViewport());

	hiddenItemsInViewport.forEach((item) => item.queue());
}

/**
 * Tell the queues to "catch up" with the viewport
 */
function _catchUpQueue(): void {
	const queues = getAllQueues();

	for (const queue of queues) {
		queue.catchUp();
	}
}

// Self-initialise
init();
