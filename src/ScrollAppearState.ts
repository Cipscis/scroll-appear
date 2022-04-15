export enum ScrollAppearState {
	UNINITIALISED = 'uninitialised',
	HIDDEN = 'hidden',
	VISIBLE = 'visible'
}

export function isScrollAppearState(val: unknown): val is ScrollAppearState {
	const states = Object.values(ScrollAppearState);

	// Use `as unknown[]` so TypeScript doesn't complain about using
	// `Array.prototype.includes` to check if an `unknown` value is included
	return (states as unknown[]).includes(val);
}
