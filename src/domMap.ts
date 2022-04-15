// These objects contain constants used to map information
// between the DOM and our model.

export const selectors = {
	item: '.js-scroll-appear',
} as const;

export const attributes = {
	state: 'data-scroll-appear-state',
	delay: 'data-scroll-appear-delay',
} as const;
