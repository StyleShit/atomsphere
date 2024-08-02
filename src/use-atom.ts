import { useSyncExternalStore } from 'react';
import type { Atom } from './atom';

export function useAtom<T>(atom: Atom<T>) {
	const value = useSyncExternalStore(atom.subscribe, atom.get);
	const setValue = atom.set;

	return [value, setValue] as const;
}
