import { throttle } from '@cipscis/throttle';
import { debounce } from '@cipscis/debounce';

import passiveSupported from './eventListenerPassiveSupport.js';

enum ScrollAppearState {
	HIDDEN = 'hidden',
	VISIBLE = 'visible',
}

const dataAttributes = {
	state: 'data-scroll-appear-state',
} as const;

const selectors = {
	uninitialised: `.js-scroll-appear:not([${dataAttributes.state}])`,
	hidden: `.js-scroll-appear[${dataAttributes.state}="${ScrollAppearState.HIDDEN}"]`,
	visible: `.js-scroll-appear[${dataAttributes.state}="${ScrollAppearState.VISIBLE}"]`,
} as const;

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
 * Find all elements and hide them. Then, show any elements within the viewport
 */
function _initElements($container: Element | Document = document): void {
	const $elements = $container.querySelectorAll(selectors.uninitialised);

	$elements.forEach(_hideElement);

	_showElementsInViewport();
}

/**
 * Show elements in the viewport any time the viewport changes through
 * scrolling or resizing.
 */
function _initEvents(): void {
	const throttledShow = throttle(_showElementsInViewport, delay);
	const debouncedShow = debounce(_showElementsInViewport, delay);

	const passiveOptions = passiveSupported ? { passive: true } : true;

	window.addEventListener('scroll', throttledShow, passiveOptions);
	window.addEventListener('scroll', debouncedShow, passiveOptions);

	window.addEventListener('resize', throttledShow, passiveOptions);
	window.addEventListener('resize', debouncedShow, passiveOptions);
}

/**
 * Find all Elements in the viewport, and show them.
 */
function _showElementsInViewport(): void {
	const $hiddenElements = Array.from(document.querySelectorAll(selectors.hidden));

	const $elementsToAppear = $hiddenElements.filter(_isElementInViewport);

	$elementsToAppear.forEach(_showElement);
}

/**
 * Hide a specific element
 */
function _hideElement($element: Element): void {
	$element.setAttribute(dataAttributes.state, ScrollAppearState.HIDDEN);
}

/**
 * Show a specific Element.
 */
function _showElement($element: Element): void {
	$element.setAttribute(dataAttributes.state, ScrollAppearState.VISIBLE);
}

/**
 * Checks if an Element is in the viewport. Only checks vertical boundaries, not horizontal.
 */
function _isElementInViewport($element: Element, threshold: number = 0): boolean {
	const windowHeight = window.innerHeight;
	const maxThreshold = (windowHeight / 2) - 50;
	if (threshold > maxThreshold) {
		threshold = maxThreshold;
	}

	const coords = $element.getBoundingClientRect();

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
