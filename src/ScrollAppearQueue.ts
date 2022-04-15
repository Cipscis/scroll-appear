import { ScrollAppearState } from './ScrollAppearState.js';
import { ScrollAppearItem } from './ScrollAppearItem.js';

// TODO: Allow for multiple queues, based either on an ID in a data attribute or a containing element

export class ScrollAppearQueue {
	#items: ScrollAppearItem[];
	#timeout: ReturnType<typeof setTimeout> | null;
	#delayRemovalTimeout: ReturnType<typeof setTimeout> | null;
	#lastItemDelay: number;

	constructor() {
		this.#items = [];
		this.#timeout = null;
		this.#delayRemovalTimeout = null;
		this.#lastItemDelay = 0;
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
			this.#items.push(item);
			this.#scheduleAppearance();
		}
	}

	/**
	 * Immediately show any items that have left the viewport
	 */
	catchUp(): void {
		for (let i = 0; i < this.#items.length; i++) {
			const item = this.#items[i];

			if (item.isInViewport() === false) {
				if (i === 0) {
					// If the first item should appepar, make it appear like normal
					this.#appearFirstItem();
				} else {
					// If a later item should appear immediately, remove it from
					// the queue and make it appear immediately
					this.#items.splice(i, 1);
					item.appear();
				}

				// Either way, the item was removed from the list,
				// so decrement `i` to make sure we don't miss an item
				i -= 1;
			}
		}
	}

	/**
	 * Checks if an item is already in the queue
	 */
	#isInQueue(item: ScrollAppearItem): boolean {
		const inQueue = this.#items.includes(item);

		return inQueue;
	}

	/**
	 * Schedule the appearance of the first item in the queue
	 */
	#scheduleAppearance(): void {
		// If the queue is empty, remove any delay for the next appearance
		if (this.#items.length === 0) {
			this.#delayRemovalTimeout = setTimeout(() => {
				this.#lastItemDelay = 0;
				this.#delayRemovalTimeout = null;
			}, this.#lastItemDelay);
			return;
		}

		// If the next item is already scheduled to appear, do nothing
		if (this.#timeout !== null) {
			return;
		}

		this.#timeout = setTimeout(() => this.#appearFirstItem(), this.#lastItemDelay);
	}

	/**
	 * Make the first item in the queue appear
	 */
	#appearFirstItem(): void {
		// If we were waiting to remove the delay for the next item,
		// stop because it's no longer relevant
		if (this.#delayRemovalTimeout) {
			clearTimeout(this.#delayRemovalTimeout);
			this.#delayRemovalTimeout = null;
		}

		// If we were waiting to display the next item,
		// stop because it's happening now
		if (this.#timeout) {
			clearTimeout(this.#timeout);
		}
		this.#timeout = null;

		let firstItem = this.#items.shift();

		// If the first item has appeared already, try the next one
		while (firstItem?.getState() === ScrollAppearState.VISIBLE) {
			firstItem = this.#items.shift();
		}

		if (firstItem) {
			firstItem.appear();
			this.#lastItemDelay = firstItem.delay;
			this.#scheduleAppearance();
		}
	}
}
