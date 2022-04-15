import { ScrollAppearQueue } from './ScrollAppearQueue.js';

const queues: Map<Document | Element | string, ScrollAppearQueue> = new Map();

const globalQueue = new ScrollAppearQueue();
queues.set(document, globalQueue);

export function getQueue(identifier: Document | Element | string = document): ScrollAppearQueue {
	const queue = queues.get(identifier) || new ScrollAppearQueue();

	if (queues.has(identifier) === false) {
		queues.set(identifier, queue);
	}

	return queue;
}

export function getAllQueues(): ScrollAppearQueue[] {
	const allQueues: ScrollAppearQueue[] = [];

	for (const map of queues.values()) {
		allQueues.push(map);
	}

	return allQueues;
}
