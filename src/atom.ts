export type ReadableAtom<T> = {
	get: () => T;
	subscribe: (subscriber: () => void) => () => void;
};

export type WritableAtom<T> = ReadableAtom<T> & {
	set: (newValue: T | ((prev: T) => T)) => void;
};

type DerivedGetter = <T>(atom: ReadableAtom<T>) => T;

export function atom<T>(derive: (get: DerivedGetter) => T): ReadableAtom<T>;
export function atom<T>(initialValue: T): WritableAtom<T>;
export function atom<T>(initialValue: T | ((get: DerivedGetter) => T)) {
	return typeof initialValue === 'function'
		? createDerivedAtom(initialValue as (get: DerivedGetter) => T)
		: createAtom(initialValue);
}

function createAtom<T>(initialValue: T): WritableAtom<T> {
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

function createDerivedAtom<T>(
	derive: (get: DerivedGetter) => T,
): ReadableAtom<T> {
	const getAndSubscribe = <T>(atom: ReadableAtom<T>) => {
		atom.subscribe(reCalculate);

		return atom.get();
	};

	const reCalculate = () => {
		atom.set(derive(getAndSubscribe));
	};

	const atom = createAtom(derive(getAndSubscribe));

	return {
		get: atom.get,
		subscribe: atom.subscribe,
	};
}
