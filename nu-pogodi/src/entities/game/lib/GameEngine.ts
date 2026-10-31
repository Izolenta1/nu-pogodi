import { EggObject } from './EggObject';
import { type EggRoute } from '../model/types';
import { mistakesEngine } from './MistakesEngine';
import { numberEngine } from './NumberEngine';
import { hareEngine } from './HareEngine';
import { DIFFICULTY_CONFIG } from '../model/DifficultyConfig';
import { type DifficultyConfig } from '../model/DifficultyConfig';
import { setVisible, setVisibleAll, querySprites, pickRandom, randomBetween, clearTimer } from './Helpers';
import { playIfRunning, eggCatchSound, eggCrackSound } from './Sound';

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

		setVisibleAll(document.querySelectorAll<HTMLElement>('.game-segment'), false);

        this.gameModeSprites = querySprites('game', { sortBy: 'index' });

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
		setVisibleAll(this.gameModeSprites, false);

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

			const randomRoute = pickRandom(this.eggRoutes.filter((route) => route !== this.wolfPos));

			this.moveWolf(randomRoute);

			this.idleWolfTimer = setTimeout(move, randomBetween(this.idleWolfDuration, this.idleWolfDuration + 1500));
		};

		move();
	}

	private stopIdleTimers() {
		this.idleTimeTimer = clearTimer(this.idleTimeTimer);
		this.idleWolfTimer = clearTimer(this.idleWolfTimer);
	}

	private spawnEgg = () => {
		if (this.isPaused) return;

		const route = pickRandom(this.eggRoutes.filter((route) => route !== this.lastSpawnRoute));
		const difficulty = this.getDifficulty();

		this.lastSpawnRoute = route;

		this.activeEggs.add(new EggObject(route, difficulty.eggFrameDuration));

		this.spawnTimer = setTimeout(this.spawnEgg, difficulty.spawnDuration);
	};

	private pauseSpawn() {
		this.isPaused = true;

		this.spawnTimer = clearTimer(this.spawnTimer);
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

		setVisibleAll(document.querySelectorAll<HTMLElement>('[data-object="wolf"]'), false);

		for (const variant of variantsToShow) {
			setVisible(querySprites('wolf', { index: sideIndex, variant })[0], true);
		}
	}

	async checkEggCatch(eggRoute: EggRoute) {
		if (this.gameState === 'idle') {
			this.moveWolf(eggRoute);
			return true;
		}

		if (this.wolfPos === eggRoute) {
			this.score += hareEngine.isHareActive() ? 2 : 1;

			playIfRunning(eggCatchSound);

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

		playIfRunning(eggCrackSound);

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

		this.spawnTimer = clearTimer(this.spawnTimer);

		if (!this.isPaused) {
			this.spawnTimer = setTimeout(this.spawnEgg, this.getDifficulty().spawnDuration);
		}
	}

	private showGameMode(mode: 0 | 1) {
		this.gameModeSprites.forEach((sprite, index) => {
			setVisible(sprite, index === mode);
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
