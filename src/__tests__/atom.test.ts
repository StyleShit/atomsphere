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

	it('should set a new value using a function', () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		countAtom.set((prev) => prev + 1);

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

	it('should derive from other atoms', () => {
		// Arrange.
		const firstNameAtom = atom('John');
		const lastNameAtom = atom('Doe');
		const countAtom = atom(0);

		// Act.
		const fullNameAtom = atom((get) => {
			if (get(countAtom) === 0) {
				return 'no-name-yet';
			}

			const firstName = get(firstNameAtom);
			const lastName = get(lastNameAtom);

			return `${firstName} ${lastName}`;
		});

		// Assert.
		expect(fullNameAtom.get()).toBe('no-name-yet');

		// Act - Should subscribe to new dependencies (firstNameAtom and lastNameAtom).
		countAtom.set(1);

		// Assert.
		expect(fullNameAtom.get()).toBe('John Doe');

		// Act - Should re-calculate the value based on the new dependencies.
		firstNameAtom.set('Jane');

		// Assert.
		expect(fullNameAtom.get()).toBe('Jane Doe');
	});

	it('should derive from derived atoms', () => {
		// Arrange.
		const countAtom = atom(0);
		const doubleCountAtom = atom((get) => get(countAtom) * 2);
		const quadrupleCountAtom = atom((get) => get(doubleCountAtom) * 2);

		// Assert.
		expect(quadrupleCountAtom.get()).toBe(0);

		// Act.
		countAtom.set(1);

		// Assert.
		expect(quadrupleCountAtom.get()).toBe(4);
	});
});
