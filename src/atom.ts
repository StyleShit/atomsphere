export function atom<T>(initialValue: T) {
	let value = initialValue;
	const subscribers = new Set<() => void>();

	const get = () => value;

	const set = (newValue: T) => {
		value = newValue;

		notify();
	};

	const subscribe = (subscriber: () => void) => {
		subscribers.add(subscriber);

		return () => subscribers.delete(subscriber);
	};

	const notify = () => {
		subscribers.forEach((cb) => {
			cb();
		});
	};

	return {
		get,
		set,
		subscribe,
	};
}
