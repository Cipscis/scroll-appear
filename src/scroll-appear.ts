import { throttle } from '@cipscis/throttle';
import { debounce } from '@cipscis/debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

import { selectors } from './constants.js';
import { hideElement } from './elements.js';
import { isElementInViewport } from './viewport.js';

import { ScrollAppearQueue } from './ScrollAppearQueue.js';

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
 * Find all elements and hide them. Then, show any elements within the viewport
 */
function _initElements($container: Element | Document = document): void {
	const $elements = $container.querySelectorAll(selectors.uninitialised);

	$elements.forEach(hideElement);

	_queueElementsInViewport();
}

/**
 * Show elements in the viewport any time the viewport changes through
 * scrolling or resizing.
 */
function _initEvents(): void {
	const passiveOptions = passiveSupported ? { passive: true } : true;

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
	const $hiddenElements = document.querySelectorAll(selectors.hidden);

	const $hiddenElementsInViewport = Array.from($hiddenElements).filter(isElementInViewport);

	$hiddenElementsInViewport.forEach(($element) => queue.push($element));
}

/**
 * Tell the queue to "catch up" with the viewport
 */
function _catchUpQueue(): void {
	queue.catchUp();
}
