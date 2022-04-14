import  {
	ScrollAppearState,
	selectors,
	dataAttributes,
} from './constants.js';

import { isElementInViewport } from './viewport.js';

/**
 * Find all Elements in the viewport, and show them.
 */
export function showElementsInViewport(): void {
	const $hiddenElements = Array.from(document.querySelectorAll(selectors.hidden));

	const $elementsToAppear = $hiddenElements.filter(isElementInViewport);

	$elementsToAppear.forEach(showElement);
}

/**
 * Hide a specific element
 */
export function hideElement($element: Element): void {
	$element.setAttribute(dataAttributes.state, ScrollAppearState.HIDDEN);
}

/**
 * Show a specific Element.
 */
export function showElement($element: Element): void {
	$element.setAttribute(dataAttributes.state, ScrollAppearState.VISIBLE);
}
