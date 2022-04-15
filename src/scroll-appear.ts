import { throttle } from '@cipscis/throttle';
import { debounce } from '@cipscis/debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

import { selectors } from './domMap.js';
import { ScrollAppearState } from "./ScrollAppearState.js";

import { getScrollAppearItem } from './ScrollAppearItem.js';
import { ScrollAppearQueue } from './ScrollAppearQueue.js';

// TODO: Improve initialisation/default styles so there is never an initial flash, without compromising no-js functionality

/** (milliseconds) Throttle/debounce delay for scroll and resize events */
const delay = 100;

const queue = new ScrollAppearQueue();

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

	// TODO: Bind events in a way that prevents a single scroll or resize event from firing the handler twice
	const throttledShow = throttle(_queueElementsInViewport, delay);
	const debouncedShow = debounce(_queueElementsInViewport, delay);

	window.addEventListener('scroll', throttledShow, passiveOptions);
	window.addEventListener('scroll', debouncedShow, passiveOptions);

	window.addEventListener('resize', throttledShow, passiveOptions);
	window.addEventListener('resize', debouncedShow, passiveOptions);

	const throttledCatchUp = throttle(_catchUpQueue, delay);
	const debouncedCatchUp = debounce(_catchUpQueue, delay);

	window.addEventListener('scroll', throttledCatchUp, passiveOptions);
	window.addEventListener('scroll', debouncedCatchUp, passiveOptions);

	window.addEventListener('resize', throttledCatchUp, passiveOptions);
	window.addEventListener('resize', debouncedCatchUp, passiveOptions);
}

/**
 * Add all hidden elements in the viewport to the queue
 */
function _queueElementsInViewport(): void {
	const $elements = Array.from(document.querySelectorAll(selectors.item));
	const items = $elements.map(getScrollAppearItem);
	const hiddenItems = items.filter((item) => item.getState() === ScrollAppearState.HIDDEN);

	const hiddenItemsInViewport = hiddenItems.filter((item) => item.isInViewport());

	hiddenItemsInViewport.forEach((item) => queue.push(item));
}

/**
 * Tell the queue to "catch up" with the viewport
 */
function _catchUpQueue(): void {
	queue.catchUp();
}
