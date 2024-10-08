import { describe, expect, expectTypeOf, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { atom } from '../atom';
import { useAtom } from '../use-atom';

describe('useAtom', () => {
	it('should set an initial value', () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		const { result } = renderHook(() => useAtom(countAtom));

		// Assert.
		expect(result.current[0]).toBe(0);
	});

	it('should set a new value', async () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		const { result } = renderHook(() => useAtom(countAtom));

		result.current[1](1);

		// Assert.
		await waitFor(() => {
			expect(result.current[0]).toBe(1);
		});
	});

	it('should set a new value using a function', async () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		const { result } = renderHook(() => useAtom(countAtom));

		result.current[1]((prev) => prev + 1);

		// Assert.
		await waitFor(() => {
			expect(result.current[0]).toBe(1);
		});
	});

	it('should re-render when the atom changes manually', async () => {
		// Arrange.
		const countAtom = atom(0);

		// Act.
		const { result } = renderHook(() => useAtom(countAtom));

		countAtom.set(1);

		// Assert.
		await waitFor(() => {
			expect(result.current[0]).toBe(1);
		});
	});

	it('should re-render a derived atom when its dependency changes', async () => {
		// Arrange.
		const countAtom = atom(0);
		const doubleCountAtom = atom((get) => get(countAtom) * 2);

		// Act.
		const { result } = renderHook(() => useAtom(doubleCountAtom));

		countAtom.set(1);

		// Assert.
		await waitFor(() => {
			expect(result.current).toBe(2);
		});
	});

	it('should have proper types', () => {
		// Arrange.
		const countAtom = atom(0);
		const stringCountAtom = atom((get) => String(get(countAtom)));

		const { result: countResult } = renderHook(() => useAtom(countAtom));

		const { result: doubleCountResult } = renderHook(() =>
			useAtom(stringCountAtom),
		);

		// Assert.
		expectTypeOf(countResult.current).toEqualTypeOf<
			[number, (value: number | ((prev: number) => number)) => void]
		>();

		expectTypeOf(doubleCountResult.current).toEqualTypeOf<string>();
	});
});
