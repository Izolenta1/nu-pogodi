import { setVisible, querySprites, randomBetween } from './Helpers';
import { HARE_CONFIG } from '../model/HareConfig';

class HareEngine {
	// База движка
	private static instance: HareEngine;
	private initialized = false;
	private constructor() {}

	// Игра
	private hare: HTMLElement | null = null;
    private isActive = false;

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
		const delay = randomBetween(HARE_CONFIG.spawnDelayMinMs, HARE_CONFIG.spawnDelayMaxMs);

		setTimeout(() => {
			this.showHare();
		}, delay);
    }

    private showHare() {
        if (!this.hare) return;

        this.isActive = true;

        setVisible(this.hare, true);

		const duration = randomBetween(HARE_CONFIG.visibleMinMs, HARE_CONFIG.visibleMaxMs);

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