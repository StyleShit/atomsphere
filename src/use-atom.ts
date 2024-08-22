import { useSyncExternalStore } from 'react';
import type { WritableAtom, ReadableAtom } from './atom';

type Setter<T> = WritableAtom<T>['set'];

export function useAtom<T>(atom: WritableAtom<T>): [T, Setter<T>];
export function useAtom<T>(atom: ReadableAtom<T>): T;
export function useAtom<T>(
	atom: WritableAtom<T> | ReadableAtom<T>,
): [T, Setter<T>] | T {
	const isWriteableAtom = 'set' in atom;
	const value = useSyncExternalStore(atom.subscribe, atom.get);

	return isWriteableAtom ? [value, atom.set] : value;
}
