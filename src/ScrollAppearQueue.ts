import { dataAttributes } from './constants.js';
import { showElement } from './elements.js';
import { isElementInViewport } from './viewport.js';

interface ScrollAppearQueueItem {
	$element: Element,
	delay: number,
}

// TODO: Make the first item appear immediately, so its delay affects the item after it instead
// TODO: Allow for multiple queues, based either on an ID in a data attribute or a containing element

export class ScrollAppearQueue {
	constructor() {
		this.items = [];
		this.timeout = null;
	}

	items: ScrollAppearQueueItem[];

	timeout: ReturnType<typeof setTimeout> | null;

	/**
	 * Add an item to the end of the queue if it's not in there already
	 */
	push($element: Element): void {
		if (this.#isInQueue($element)) {
			return;
		}

		const delay = Number($element.getAttribute(dataAttributes.delay)) || 0;

		const item: ScrollAppearQueueItem = {
			$element,
			delay,
		};

		this.items.push(item);
		this.#scheduleExecution();
	}

	/**
	 * Immediately show any elements that have left the viewport
	 */
	catchUp(): void {
		for (const [i, item] of this.items.entries()) {
			if (isElementInViewport(item.$element) === false) {
				if (i === 0) {
					this.#execute();
				} else {
					this.items.splice(i, 1);
					showElement(item.$element);
				}
			}
		}
	}

	/**
	 * Checks if an element is already in the queue
	 */
	#isInQueue($element: Element): boolean {
		const item = this.items.find((item) => item.$element === $element);

		return !!item;
	}

	/**
	 * Schedule the execution of the first item in the queue
	 */
	#scheduleExecution(): void {
		const nextItem = this.items[0];

		if (nextItem && this.timeout === null) {
			this.timeout = setTimeout(() => this.#execute(), nextItem.delay);
		}
	}

	/**
	 * Make the first item in the queue appear
	 */
	#execute(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = null;

		const nextItem = this.items.shift();

		if (nextItem) {
			showElement(nextItem.$element);
			this.#scheduleExecution();
		}
	}
}
