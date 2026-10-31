import { describe, expect, it, vi } from 'vitest';
import { clearTimer, pickRandom, randomBetween, setVisible, setVisibleAll } from './Helpers';

// Функция-хелпер для создания элемента для тестирования
function fakeEl() {
	const on = new Set<string>();
	return {
		classList: {
			toggle(name: string, force?: boolean) {
				const show = force ?? !on.has(name);
				if (show) on.add(name);
				else on.delete(name);
			},
		},
		has: (name: string) => on.has(name),
	};
}

describe('setVisible', () => {
	it('switches is-visible and is-hidden', () => {
		const el = fakeEl();

		setVisible(el as unknown as HTMLElement, true);
		expect(el.has('is-visible')).toBe(true);
		expect(el.has('is-hidden')).toBe(false);

		setVisible(el as unknown as HTMLElement, false);
		expect(el.has('is-visible')).toBe(false);
		expect(el.has('is-hidden')).toBe(true);
	});

	it('ignores a missing element', () => {
		expect(() => setVisible(null, true)).not.toThrow();
		expect(() => setVisible(undefined, false)).not.toThrow();
	});
});

describe('setVisibleAll', () => {
	it('applies one flag to every element', () => {
		const els = [fakeEl(), fakeEl()];

		setVisibleAll(els as unknown as HTMLElement[], false);
		expect(els.every((el) => el.has('is-hidden') && !el.has('is-visible'))).toBe(true);
	});
});

describe('pickRandom', () => {
	it('picks by Math.random', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		expect(pickRandom(['a', 'b', 'c'])).toBe('a');

		vi.spyOn(Math, 'random').mockReturnValue(0.99);
		expect(pickRandom(['a', 'b', 'c'])).toBe('c');

		vi.restoreAllMocks();
	});
});

describe('randomBetween', () => {
	it('maps 0..1 onto min..max', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		expect(randomBetween(20, 30)).toBe(20);

		vi.spyOn(Math, 'random').mockReturnValue(0.5);
		expect(randomBetween(20, 30)).toBe(25);

		vi.restoreAllMocks();
	});
});

describe('clearTimer', () => {
	it('clears the id and returns null', () => {
		const spy = vi.spyOn(globalThis, 'clearTimeout');

		expect(clearTimer(7)).toBeNull();
		expect(spy).toHaveBeenCalledWith(7);

		expect(clearTimer(null)).toBeNull();
		expect(spy).toHaveBeenCalledTimes(1);
		
		spy.mockRestore();
	});
});