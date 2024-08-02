import { useSyncExternalStore } from 'react';
import type { WritableAtom, ReadableAtom } from './atom';

export function useAtom<T>(
	atom: WritableAtom<T>,
): [WritableAtom<T>['get'], WritableAtom<T>['set']];

export function useAtom<T>(atom: ReadableAtom<T>): ReadableAtom<T>['get'];

export function useAtom<T>(atom: WritableAtom<T> | ReadableAtom<T>): any {
	const isDerivedAtom = !('set' in atom);
	const value = useSyncExternalStore(atom.subscribe, atom.get);

	if (isDerivedAtom) {
		return value;
	}

	return [value, atom.set] as const;
}
