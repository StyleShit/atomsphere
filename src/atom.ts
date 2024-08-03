export type ReadableAtom<T> = {
	get: () => T;
	subscribe: (subscriber: () => void) => () => void;
};

export type WritableAtom<T> = ReadableAtom<T> & {
	set: (newValue: T | ((prev: T) => T)) => void;
};

type DeriveFn<T> = (get: <P>(atom: ReadableAtom<P>) => P) => T;

export function atom<T>(initialValue: DeriveFn<T>): ReadableAtom<T>;
export function atom<T>(initialValue: T): WritableAtom<T>;
export function atom<T>(initialValue: T | DeriveFn<T>) {
	return typeof initialValue === 'function'
		? createDerivedAtom(initialValue as DeriveFn<T>)
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
		subscribers.forEach((subscriber) => {
			subscriber();
		});
	};

	return {
		get,
		set,
		subscribe,
	};
}

function createDerivedAtom<T>(derive: DeriveFn<T>): ReadableAtom<T> {
	const getAndSubscribe = <P>(atom: ReadableAtom<P>) => {
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
