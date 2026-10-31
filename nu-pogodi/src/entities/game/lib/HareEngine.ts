class HareEngine {
	// База движка
	private static instance: HareEngine;
	private initialized = false;
	private constructor() {}

	// Игра
	private hare: HTMLElement | null = null;
    private isActive = false;

    private spawnTimer: ReturnType<typeof setTimeout> | null = null;
    private hideTimer: ReturnType<typeof setTimeout> | null = null;

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

		this.hare = document.querySelector('[data-object="hare"][data-index="0"][data-variant="0"]');

        this.hare?.classList.add('is-hidden');
        this.hare?.classList.remove('is-visible');

        this.initialized = true;

        this.scheduleSpawn();
	}

    private getRandomDuration(min: number, max: number) {
        return min + Math.random() * (max - min);
    }

    private scheduleSpawn() {
        const delay = this.getRandomDuration(
            this.minSpawnDelay,
            this.maxSpawnDelay
        );

        this.spawnTimer = setTimeout(() => {
            this.showHare();
        }, delay);
    }

    private showHare() {
        if (!this.hare) return;

        this.isActive = true;

        this.hare.classList.remove('is-hidden');
        this.hare.classList.add('is-visible');

        const duration = this.getRandomDuration(
            this.minVisibleDuration,
            this.maxVisibleDuration
        );

        this.hideTimer = setTimeout(() => {
            this.hideHare();
        }, duration);
    }

    private hideHare() {
        if (!this.hare) return;

        this.isActive = false;

        this.hare.classList.remove('is-visible');
        this.hare.classList.add('is-hidden');

        this.scheduleSpawn();
    }

    isHareActive() {
        return this.isActive;
    }
}

export const hareEngine = HareEngine.getInstance();