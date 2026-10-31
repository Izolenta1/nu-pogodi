export function setVisible(el: HTMLElement | null | undefined, visible: boolean) {
	el?.classList.toggle('is-hidden', !visible);
	el?.classList.toggle('is-visible', visible);
}

export function setVisibleAll(els: Iterable<HTMLElement>, visible: boolean) {
	for (const el of els) setVisible(el, visible);
}

export function querySprites(
	object: string,
	options: { index?: number; variant?: number; sortBy?: 'index' | 'variant' } = {},
): HTMLElement[] {
	const { index, variant, sortBy = 'variant' } = options;
	let selector = `[data-object="${object}"]`;

	if (index !== undefined) selector += `[data-index="${index}"]`;
	if (variant !== undefined) selector += `[data-variant="${variant}"]`;

	return Array.from(document.querySelectorAll<HTMLElement>(selector)).sort(
		(a, b) => Number(a.dataset[sortBy]) - Number(b.dataset[sortBy]),
	);
}

export function pickRandom<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

export function randomBetween(min: number, max: number) {
	return min + Math.random() * (max - min);
}

export function clearTimer(id: number | null) {
	if (id !== null) clearTimeout(id);
	return null;
}