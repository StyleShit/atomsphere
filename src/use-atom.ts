import { useSyncExternalStore } from 'react';
import type { WritableAtom, ReadableAtom } from './atom';

export function useAtom<T>(
	atom: WritableAtom<T>,
): [WritableAtom<T>['get'], WritableAtom<T>['set']];

export function useAtom<T>(atom: ReadableAtom<T>): ReadableAtom<T>['get'];

export function useAtom<T>(atom: WritableAtom<T> | ReadableAtom<T>) {
	const isWriteableAtom = 'set' in atom;
	const value = useSyncExternalStore(atom.subscribe, atom.get);

	return isWriteableAtom ? [value, atom.set] : value;
}
