import { ScrollAppearState } from './constants.js';
import { ScrollAppearItem } from './ScrollAppearItem.js';

// TODO: Make the first item appear immediately, so its delay affects the item after it instead
// TODO: Allow for multiple queues, based either on an ID in a data attribute or a containing element

export class ScrollAppearQueue {
	items: ScrollAppearItem[];
	timeout: ReturnType<typeof setTimeout> | null;

	constructor() {
		this.items = [];
		this.timeout = null;
	}

	/**
	 * Add a new item to the end of the queue if it's not in there already
	 */
	push(item: ScrollAppearItem): void {
		if (this.#isInQueue(item)) {
			return;
		}

		// If the item is hidden, add it to the queue and schedule its appearance
		if (item.getState() === ScrollAppearState.HIDDEN) {
			this.items.push(item);
			this.#scheduleAppearance();
		}
	}

	/**
	 * Immediately show any items that have left the viewport
	 */
	catchUp(): void {
		for (const [i, item] of this.items.entries()) {
			if (item.isInViewport() === false) {
				if (i === 0) {
					// If the first item should appear, make it appear like normal
					this.#appearFirstItem();
				} else {
					// If a later item should appear immediately, remove it from
					// the queue and make it appear immediately
					this.items.splice(i, 1);
					item.appear();
				}
			}
		}
	}

	/**
	 * Checks if an item is already in the queue
	 */
	#isInQueue(item: ScrollAppearItem): boolean {
		const inQueue = this.items.find((queueItem) => queueItem === item);

		return !!inQueue;
	}

	/**
	 * Schedule the appearance of the first item in the queue
	 */
	#scheduleAppearance(): void {
		const nextItem = this.items[0];

		if (nextItem && this.timeout === null) {
			this.timeout = setTimeout(() => this.#appearFirstItem(), nextItem.delay);
		}
	}

	/**
	 * Make the first item in the queue appear
	 */
	#appearFirstItem(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = null;

		const nextItem = this.items.shift();

		if (nextItem) {
			nextItem.appear();
			this.#scheduleAppearance();
		}
	}
}
