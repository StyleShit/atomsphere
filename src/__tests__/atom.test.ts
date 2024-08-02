import { describe, expect, it, vi } from 'vitest';
import { atom } from '../atom';

describe('atom', () => {
	it('should set an initial value', () => {
		// Act.
		const countAtom = atom(0);

		// Assert.
		expect(countAtom.get()).toBe(0);
	});

	it('should set a new value', () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		countAtom.set(1);

		// Assert.
		expect(countAtom.get()).toBe(1);
	});

	it('should notify subscribers', () => {
		// Arrange.
		const countAtom = atom(0);
		const subscriber = vi.fn();

		// Act.
		countAtom.subscribe(subscriber);
		countAtom.set(1);

		// Assert.
		expect(subscriber).toHaveBeenCalledTimes(1);
	});

	it('should unsubscribe subscribers', () => {
		// Arrange.
		const countAtom = atom(0);
		const subscriber = vi.fn();

		// Act.
		const unsubscribe = countAtom.subscribe(subscriber);
		unsubscribe();

		countAtom.set(1);

		// Assert.
		expect(subscriber).toHaveBeenCalledTimes(0);
	});
});
