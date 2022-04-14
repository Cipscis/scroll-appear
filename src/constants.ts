export enum ScrollAppearState {
	HIDDEN = 'hidden',
	VISIBLE = 'visible',
}

export const dataAttributes = {
	state: 'data-scroll-appear-state',
	delay: 'data-scroll-appear-delay',
} as const;

export const selectors = {
	uninitialised: `.js-scroll-appear:not([${dataAttributes.state}])`,
	hidden: `.js-scroll-appear[${dataAttributes.state}="${ScrollAppearState.HIDDEN}"]`,
	visible: `.js-scroll-appear[${dataAttributes.state}="${ScrollAppearState.VISIBLE}"]`,
} as const;
