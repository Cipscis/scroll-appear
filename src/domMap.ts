// These objects contain constants used to map information
// between the DOM and our model.

export const selectors = {
	item: '.js-scroll-appear',
	newItem: '.js-scroll-appear:not([data-scroll-appear-state])',
	container: '.js-scroll-appear__container',
} as const;

export const attributes = {
	state: 'data-scroll-appear-state',
	delay: 'data-scroll-appear-delay',
	queue: 'data-scroll-appear-queue',
} as const;
