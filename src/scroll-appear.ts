import { throttleWithDebounce } from '@cipscis/throttle-with-debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

import { selectors } from './domMap.js';
import { ScrollAppearState } from './ScrollAppearState.js';

import {
	ScrollAppearItem,
	getScrollAppearItem,
} from './ScrollAppearItem.js';
import { getAllQueues } from './queues.js';

/** (milliseconds) Throttle/debounce delay for scroll and resize events */
const delay = 200;

/**
 * This `MutationObserver` watches for any new elements added to the page,
 * and if it finds any then it initialises any `ScrollAppearItem` elements.
 */
const observer = new MutationObserver(_checkNewElements);

/**
 * Initialise ScrollAppear items and functionality
 */
function init(): void {
	_initAndQueueItems();
	_initEvents();
	_initObserver();
}

/**
 * Show elements in the viewport any time the viewport changes through
 * scrolling or resizing.
 */
function _initEvents(): void {
	const passiveOptions = passiveSupported ? { passive: true } : true;

	const throttledShow = throttleWithDebounce(_initAndQueueItemsEvent, delay);

	window.addEventListener('scroll', throttledShow, passiveOptions);
	window.addEventListener('resize', throttledShow, passiveOptions);

	const throttledCatchUp = throttleWithDebounce(_catchUpQueue, delay);

	window.addEventListener('scroll', throttledCatchUp, passiveOptions);
	window.addEventListener('resize', throttledCatchUp, passiveOptions);
}

/**
 * Tell `observer` to start watching the entire DOM for `Node` insertion
 */
function _initObserver(): void {
	observer.observe(document, {
		childList: true,
		subtree: true,
	});
}

/**
 * If any new `Element`s have been added, initialise any new `ScrollAppearItem`s
 */
function _checkNewElements(mutations: MutationRecord[], oberver: MutationObserver): void {
	let nodesAdded = false;

	for (const mutation of mutations) {
		if (mutation.addedNodes.length > 0) {
			nodesAdded = true;
			break;
		}
	}

	if (nodesAdded === true) {
		const $elements = document.querySelectorAll(selectors.item);
		if ($elements.length > 0) {
			_initAndQueueItems($elements);
		}
	}
}

/**
 * Initialise all items, optionally limited to a set of elements,
 * then queue all of them that are currently in the viewport
 */
function _initAndQueueItems($elements?: ArrayLike<Element>): void {
	const items = _initElements($elements);
	_queueHiddenItemsInViewport(items);
}

/**
 * A variation of `_initAndQueueItems` meant to be bound to events
 */
function _initAndQueueItemsEvent(e: Event): void {
	_initAndQueueItems();
}

/**
 * Retrieve the `ScrollAppearItem` for each `Element`. If they don't
 * already have a `ScrollAppearItem`, creating one will initialise them
 */
function _initElements($elements?: ArrayLike<Element>): ScrollAppearItem[] {
	if (!$elements) {
		$elements = document.querySelectorAll(selectors.item);
	}

	const items = Array.from($elements).map(getScrollAppearItem);

	return items;
}

/**
 * For each hidden item in the viewport, add it to the appropriate queue
 */
function _queueHiddenItemsInViewport(items: ScrollAppearItem[]): void {
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
