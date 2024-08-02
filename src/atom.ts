export type Atom<T> = {
	get: () => T;
	set: (newValue: T | ((prev: T) => T)) => void;
	subscribe: (subscriber: () => void) => () => void;
};

export function atom<T>(initialValue: T): Atom<T> {
	let value = initialValue;

	const subscribers = new Set<() => void>();

	const get = () => value;

	const set = (newValue: T | ((prev: T) => T)) => {
		value =
			typeof newValue === 'function'
				? (newValue as (prev: T) => T)(value)
				: newValue;

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
