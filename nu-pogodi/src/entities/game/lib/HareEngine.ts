import { setVisible, querySprites, randomBetween } from './Helpers';

class HareEngine {
	// База движка
	private static instance: HareEngine;
	private initialized = false;
	private constructor() {}

	// Игра
	private hare: HTMLElement | null = null;
    private isActive = false;

    private readonly minSpawnDelay = 20_000;
    private readonly maxSpawnDelay = 30_000;

    private readonly minVisibleDuration = 5_000;
    private readonly maxVisibleDuration = 10_000;

	static getInstance() {
		if (!HareEngine.instance) {
			HareEngine.instance = new HareEngine();
		}

		return HareEngine.instance;
	}

	init() {
		if (this.initialized) return;

		this.hare = querySprites('hare', { index: 0, variant: 0 })[0] ?? null;

        setVisible(this.hare, false);

        this.initialized = true;

        this.scheduleSpawn();
	}

    private scheduleSpawn() {
		const delay = randomBetween(this.minSpawnDelay, this.maxSpawnDelay);

		setTimeout(() => {
			this.showHare();
		}, delay);
    }

    private showHare() {
        if (!this.hare) return;

        this.isActive = true;

        setVisible(this.hare, true);

		const duration = randomBetween(this.minVisibleDuration, this.maxVisibleDuration);

		setTimeout(() => {
			this.hideHare();
		}, duration);
    }

    private hideHare() {
        if (!this.hare) return;

        this.isActive = false;

        setVisible(this.hare, false);

        this.scheduleSpawn();
    }

    isHareActive() {
        return this.isActive;
    }
}

export const hareEngine = HareEngine.getInstance();