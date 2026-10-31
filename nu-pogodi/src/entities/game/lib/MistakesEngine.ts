import { type EggRoute } from "../model/types";
import { gameEngine } from "./GameEngine";

// Задержка
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Переключение видимости
function setVisibility(el: HTMLElement, visible: boolean) {
	el.classList.toggle('is-hidden', !visible);
	el.classList.toggle('is-visible', visible);
}

const eggRideSound = new Audio('/sounds/egg_ride.ogg');

class MistakesEngine {
	// База движка
	private static instance: MistakesEngine;
	private initialized = false;
	private constructor() {}

	// Игра
    private lifes: HTMLElement[] = [];
	private leftFrames: HTMLElement[] = [];
	private rightFrames: HTMLElement[] = [];
	private readonly frameDuration = 500;

	static getInstance() {
		if (!MistakesEngine.instance) {
			MistakesEngine.instance = new MistakesEngine();
		}

		return MistakesEngine.instance;
	}

	init() {
		if (this.initialized) return;

		this.initialized = true;

        this.lifes = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-object="life"]'
            )
        ).sort((a, b) => {
			return Number(a.dataset.variant) - Number(b.dataset.variant);
		});

        this.leftFrames = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-object="chicken"][data-index="0"]'
            )
        ).sort((a, b) => {
			return Number(a.dataset.variant) - Number(b.dataset.variant);
		});

        this.rightFrames = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-object="chicken"][data-index="1"]'
            )
        ).sort((a, b) => {
			return Number(a.dataset.variant) - Number(b.dataset.variant);
		});
	}

    // Скрытие всех кадров
    private clearFrames() {
        [...this.leftFrames, ...this.rightFrames].forEach(el => {
            setVisibility(el, false);
        });
    }

    // Анимация цыпленка
    private async playChickenAnimation(side: EggRoute) {
        const frames = side.startsWith('left')
            ? this.leftFrames
            : this.rightFrames;

        // Скрываем все кадры
        this.clearFrames();

        // Показываем первые два кадра
        setVisibility(frames[0], true);
        setVisibility(frames[1], true);

        await delay(this.frameDuration);

        // Последовательно показываем кадры 2-5
        setVisibility(frames[0], false);

        for (let i = 2; i <= 5; i++) {
            setVisibility(frames[i], true);

			if (gameEngine.isGameRunning()) eggRideSound.play();

            await delay(this.frameDuration);

            setVisibility(frames[i], false);
        }

        // Скрываем оставшийся первый кадр (variant 1)
        setVisibility(frames[1], false);
    }

    private showLifes(lifes: number) {
        const count = Math.max(0, Math.min(lifes, this.lifes.length));

        this.lifes.forEach((el, index) => {
            setVisibility(el, index < count);
        });
    }

	async countMistake(lifes: number, side: EggRoute) {
        await this.playChickenAnimation(side);

        this.showLifes(lifes);
	}
	
	clearLifes() {
        this.lifes.forEach(el => {
            setVisibility(el, false);
        });
	}
}

export const mistakesEngine = MistakesEngine.getInstance();