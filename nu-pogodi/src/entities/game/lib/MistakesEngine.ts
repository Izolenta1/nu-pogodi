import { type EggRoute } from "../model/types";
import { setVisible, setVisibleAll, querySprites } from './Helpers';
import { playIfRunning, eggRideSound } from './Sound';
import { ANIMATION_CONFIG } from '../model/AnimationConfig';

// Задержка
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class MistakesEngine {
	// База движка
	private static instance: MistakesEngine;
	private initialized = false;
	private constructor() {}

	// Игра
    private lifes: HTMLElement[] = [];
	private leftFrames: HTMLElement[] = [];
	private rightFrames: HTMLElement[] = [];

	static getInstance() {
		if (!MistakesEngine.instance) {
			MistakesEngine.instance = new MistakesEngine();
		}

		return MistakesEngine.instance;
	}

	init() {
		if (this.initialized) return;

		this.initialized = true;

        this.lifes = querySprites('life');
		this.leftFrames = querySprites('chicken', { index: 0 });
		this.rightFrames = querySprites('chicken', { index: 1 });
	}

    // Скрытие всех кадров
    private clearFrames() {
        setVisibleAll([...this.leftFrames, ...this.rightFrames], false);
    }

    // Анимация цыпленка
    private async playChickenAnimation(side: EggRoute) {
        const frames = side.startsWith('left')
            ? this.leftFrames
            : this.rightFrames;

        // Скрываем все кадры
        this.clearFrames();

        // Показываем первые два кадра
        setVisible(frames[0], true);
        setVisible(frames[1], true);

        await delay(ANIMATION_CONFIG.mistakeFrameMs);

        // Последовательно показываем кадры 2-5
        setVisible(frames[0], false);

        for (let i = 2; i <= 5; i++) {
            setVisible(frames[i], true);

			playIfRunning(eggRideSound);

            await delay(ANIMATION_CONFIG.mistakeFrameMs);

            setVisible(frames[i], false);
        }

        // Скрываем оставшийся первый кадр (variant 1)
        setVisible(frames[1], false);
    }

    private showLifes(lifes: number) {
        const count = Math.max(0, Math.min(lifes, this.lifes.length));

        this.lifes.forEach((el, index) => {
            setVisible(el, index < count);
        });
    }

	async countMistake(lifes: number, side: EggRoute) {
        await this.playChickenAnimation(side);

        this.showLifes(lifes);
	}
	
	clearLifes() {
        setVisibleAll(this.lifes, false);
	}
}

export const mistakesEngine = MistakesEngine.getInstance();