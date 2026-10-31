import { EggObject } from './EggObject';
import { type EggRoute } from '../model/types';
import { mistakesEngine } from './MistakesEngine';
import { numberEngine } from './NumberEngine';
import { hareEngine } from './HareEngine';
import { DIFFICULTY_CONFIG } from '../model/DifficultyConfig';
import { type DifficultyConfig } from '../model/DifficultyConfig';

const eggCatchSound = new Audio('/sounds/egg_catch.ogg');
const eggCrackSound = new Audio('/sounds/egg_crack.ogg');

class GameEngine {
	// База движка
	private static instance: GameEngine;
	private initialized = false;
	private constructor() {}

	// Игра
	private gameState: 'idle' | 'startA' | 'startB' | 'over' | 'animating' | null = null;
	private wolfPos: EggRoute = 'leftUp';
	private activeEggs = new Set<EggObject>();
	private score = 0;
	private mistakes = 0;
	private isPaused = false;
	private spawnTimer: ReturnType<typeof setTimeout> | null = null;
	private lastSpawnRoute: EggRoute | null = null;
	private readonly eggRoutes: EggRoute[] = [
		'leftUp',
		'leftDown',
		'rightUp',
		'rightDown',
	];

	// Idle состояние
	private idleTimeTimer: ReturnType<typeof setInterval> | null = null;
	private idleWolfTimer: ReturnType<typeof setInterval> | null = null;
	private readonly idleWolfDuration = 1500;

	// Спрайты
	private gameModeSprites: HTMLElement[] = [];
	private resultScreen: HTMLElement | null = null;
	private resultScreenTitle: HTMLElement | null = null;
	private resultScreenScore: HTMLElement | null = null;

	static getInstance() {
		if (!GameEngine.instance) {
			GameEngine.instance = new GameEngine();
		}

		return GameEngine.instance;
	}

	init() {
		if (this.initialized) return;

		this.initialized = true;

		document.querySelectorAll('.game-segment').forEach((el) => {
			el.classList.toggle('is-hidden', true);
			el.classList.toggle('is-visible', false);
		});

        this.gameModeSprites = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-object="game"]'
            )
        ).sort((a, b) => {
			return Number(a.dataset.index) - Number(b.dataset.index);
		});

		this.resultScreen = document.querySelector('[data-object="result-screen"]');
		this.resultScreenTitle = document.querySelector('[data-object="result-screen-title"]');
		this.resultScreenScore = document.querySelector('[data-object="result-screen-score"]');

		mistakesEngine.init();
		numberEngine.init();
		hareEngine.init();

		this.idle();
	}

	idle() {
		if (this.gameState === 'idle' || this.gameState === 'animating') return;

		this.resetGame();

		this.gameState = 'idle';
		this.gameModeSprites.forEach((sprite) => {
			sprite.classList.toggle('is-hidden', true);
			sprite.classList.toggle('is-visible', false);
		});

		this.score = 0;
		this.mistakes = 0;

		this.hideResultScreen();
		this.clearEggs();
		this.pauseSpawn();

		this.stopIdleTimers();

		numberEngine.showTime();

		this.idleTimeTimer = setInterval(() => {
			numberEngine.showTime();
		}, 1000);

		this.isPaused = false;

		this.spawnEgg();

		this.startIdleWolfMovement();
	}

	private startIdleWolfMovement() {
		const move = () => {
			if (this.gameState !== 'idle') return;

			const availableRoutes = this.eggRoutes.filter((route) => route !== this.wolfPos);

			const randomRoute = availableRoutes[Math.floor(Math.random() * availableRoutes.length)];

			this.moveWolf(randomRoute);

			this.idleWolfTimer = setTimeout(move, this.idleWolfDuration + Math.random() * 1500);
		};

		move();
	}

	private stopIdleTimers() {
		if (this.idleTimeTimer !== null) {
			clearInterval(this.idleTimeTimer);
			this.idleTimeTimer = null;
		}

		if (this.idleWolfTimer !== null) {
			clearTimeout(this.idleWolfTimer);
			this.idleWolfTimer = null;
		}
	}

	private getRandomRoute(): EggRoute {
		const availableRoutes = this.eggRoutes.filter((route) => route !== this.lastSpawnRoute);

		return availableRoutes[Math.floor(Math.random() * availableRoutes.length)];
	}

	private spawnEgg = () => {
		if (this.isPaused) return;

		const route = this.getRandomRoute();
		const difficulty = this.getDifficulty();

		this.lastSpawnRoute = route;

		this.activeEggs.add(new EggObject(route, difficulty.eggFrameDuration));

		this.spawnTimer = setTimeout(this.spawnEgg, difficulty.spawnDuration);
	};

	private pauseSpawn() {
		this.isPaused = true;

		if (this.spawnTimer !== null) {
			clearTimeout(this.spawnTimer);
			this.spawnTimer = null;
		}
	}

	private resumeSpawn() {
		if (!this.isPaused) return;

		this.isPaused = false;

		if (this.spawnTimer === null) {
			this.spawnEgg();
		}
	}

	private clearEggs() {
		this.activeEggs.forEach((egg) => egg.destroy());
		this.activeEggs.clear();
	}

	startA() {
		if (this.gameState === 'startA' || this.gameState === 'animating') return;

		this.resetGame();

		this.gameState = 'startA';
		this.showGameMode(0);

		if (this.spawnTimer !== null) return;

		this.spawnEgg();
	}

	startB() {
		if (this.gameState === 'startB' || this.gameState === 'animating') return;

		this.resetGame();

		this.gameState = 'startB';
		this.showGameMode(1);

		if (this.spawnTimer !== null) return;

		this.spawnEgg();
	}

	moveWolf(pos: EggRoute, userMove = false) {
		if (userMove && this.gameState === 'idle') return;

		this.wolfPos = pos;

		const sideIndex = pos.startsWith('left') ? 0 : 1;
		const basketVariant = pos.endsWith('Up') ? 1 : 2;
		const variantsToShow = [0, basketVariant];

		document.querySelectorAll('[data-object="wolf"]').forEach((el) => {
			el.classList.toggle('is-hidden', true);
			el.classList.toggle('is-visible', false);
		});

		for (const variant of variantsToShow) {
			const target = document.querySelector(
				`[data-object="wolf"][data-index="${sideIndex}"][data-variant="${variant}"]`,
			);
			if (target) {
				target.classList.toggle('is-hidden', false);
				target.classList.toggle('is-visible', true);
			}
		}
	}

	async checkEggCatch(eggRoute: EggRoute) {
		if (this.gameState === 'idle') {
			this.moveWolf(eggRoute);
			return true;
		}

		if (this.wolfPos === eggRoute) {
			this.score += hareEngine.isHareActive() ? 2 : 1;

			if (this.isGameRunning()) eggCatchSound.play();

			numberEngine.showScore(this.score);

			this.updateDifficulty();

			if (this.score >= 1000) {
				this.gameState = 'over';
				this.clearEggs();
				this.pauseSpawn();
				this.showResultScreen(true);
				return true;
			}

			return true;
		}

		this.mistakes++;

		if (this.isGameRunning()) eggCrackSound.play();

		this.clearEggs();
		this.pauseSpawn();
		const savedState = this.gameState;
		this.gameState = 'animating';
		await mistakesEngine.countMistake(this.mistakes, eggRoute);
		this.gameState = savedState;

		if (this.mistakes <= 3) {
			this.resumeSpawn();
			return false;
		}

		this.gameState = 'over';
		this.showResultScreen(false);

		return false;
	}

	private getDifficulty(): DifficultyConfig {
		const mode = this.gameState;

		if (mode !== 'startA' && mode !== 'startB') {
			return DIFFICULTY_CONFIG.startA[0];
		}

		const difficultyLevels = DIFFICULTY_CONFIG[mode];

		const thresholds = [0, 50, 100, 150];

		const currentLevel = thresholds.filter((threshold) => this.score >= threshold).length - 1;

		const maxLevel = difficultyLevels.length - 1;

		return difficultyLevels[Math.min(currentLevel, maxLevel)];
	}

	private updateDifficulty() {
		if (![50, 100, 150].includes(this.score)) return;

		if (this.spawnTimer !== null) {
			clearTimeout(this.spawnTimer);
			this.spawnTimer = null;
		}

		if (!this.isPaused) {
			this.spawnTimer = setTimeout(this.spawnEgg, this.getDifficulty().spawnDuration);
		}
	}

	private showGameMode(mode: 0 | 1) {
		this.gameModeSprites.forEach((sprite, index) => {
			const isActive = index === mode;
	
			sprite.classList.toggle('is-hidden', !isActive);
			sprite.classList.toggle('is-visible', isActive);
		});
	}

	private showResultScreen(isWin: boolean) {
		this.resultScreen?.classList.toggle('hidden', false);
		this.resultScreen?.classList.toggle('flex', true);
		if (this.resultScreenTitle) this.resultScreenTitle.textContent = isWin ? 'ВЫ ПОБЕДИЛИ' : 'ВЫ ПРОИГРАЛИ';
		if (this.resultScreenScore) this.resultScreenScore.textContent = this.score.toString();
	}

	private hideResultScreen() {
		this.resultScreen?.classList.toggle('hidden', true);
		this.resultScreen?.classList.toggle('flex', false);
	}

	private resetGame() {
		this.hideResultScreen();
		this.stopIdleTimers();
		this.clearEggs();
		this.score = 0;
		this.mistakes = 0;
		this.isPaused = false;
		mistakesEngine.clearLifes();
		numberEngine.showScore(this.score);
		this.moveWolf('leftUp');
	}

	isGameRunning() {
		return this.gameState === 'startA' || this.gameState === 'startB' || this.gameState === 'animating';
	}
}

export const gameEngine = GameEngine.getInstance();
