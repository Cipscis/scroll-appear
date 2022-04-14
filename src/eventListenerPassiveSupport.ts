/**
 * Some older browsers don't support passing an options object to `addEventListener`,
 * instead expecting a booolean value to tell them if the event is passive. To detect
 * how the current browser expects to tell if an event is passive, temporarily bind
 * a dummy event that passes an object with a getter in its `passive` property so we
 * can detect if the browser tried to access it.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#safely_detecting_option_support
 */
let passiveSupported = false;
try {
	const options = {
		get passive() {
			passiveSupported = true;
			return false;
		},
	} as EventListenerOptions;

	const noop = () => {};

	window.addEventListener('test', noop, options);
	window.removeEventListener('test', noop);
} catch (e) {
	passiveSupported = false;
}

export default passiveSupported;
