/**
 * Checks if an Element is in the viewport. Only checks vertical boundaries, not horizontal.
 */
export function isElementInViewport($element: Element, threshold: number = 0): boolean {
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
