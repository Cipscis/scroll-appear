import { throttleWithDebounce } from '@cipscis/throttle-with-debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

import { selectors } from './domMap.js';
import { ScrollAppearState } from './ScrollAppearState.js';

import { getScrollAppearItem } from './ScrollAppearItem.js';
import { getAllQueues } from './queues.js';

// TODO: Improve initialisation/default styles so there is never an initial flash, without compromising no-js functionality

/** (milliseconds) Throttle/debounce delay for scroll and resize events */
const delay = 100;

/**
 * Initialise ScrollAppear for a particular set of elements
 */
export function init($container: Element | Document = document): void {
	_initElements($container);

	_initEvents();
}

/**
 * Find all scroll appear elements and initialise them. Then, show any elements within the viewport
 */
function _initElements($container: Element | Document = document): void {
	const $elements = Array.from($container.querySelectorAll(selectors.item));

	$elements.forEach(_initElement);

	_queueElementsInViewport();
}

/**
 * Create a `ScrollAppearItem` for an `Element`, letting its constructor perform the necessary initialisation.
 * We can retrieve the same `ScrollAppearItem` later, so we don't need to remember it now.
 */
function _initElement($element: Element): void {
	getScrollAppearItem($element);
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
 * Add all hidden elements in the viewport to the queue
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
