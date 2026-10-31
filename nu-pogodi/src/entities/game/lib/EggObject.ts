import { type EggRoute } from '../model/types';
import { gameEngine } from './GameEngine';

const EGG_ROUTE: Record<EggRoute, { side: 0 | 1; variants: readonly number[] }> = {
	leftUp: { side: 0, variants: [0, 1, 2, 3, 4] },
	leftDown: { side: 0, variants: [10, 11, 12, 13, 14] },
	rightUp: { side: 1, variants: [0, 1, 2, 3, 4] },
	rightDown: { side: 1, variants: [10, 11, 12, 13, 14] },
};

const holders = new WeakMap<HTMLElement, number>();

function reveal(el: HTMLElement) {
	const n = (holders.get(el) ?? 0) + 1;
	holders.set(el, n);
	el.classList.toggle('is-hidden', false);
	el.classList.toggle('is-visible', true);
}

function conceal(el: HTMLElement) {
	const n = (holders.get(el) ?? 1) - 1;
	if (n > 0) {
		holders.set(el, n);
		return;
	}
	holders.delete(el);
	el.classList.toggle('is-hidden', true);
	el.classList.toggle('is-visible', false);
}

const eggRideSound = new Audio('/sounds/egg_ride.ogg');

export class EggObject {
	private frames: HTMLElement[] = [];
	private currentFrame = 0;
	private shown = false;
	private timerId: ReturnType<typeof setTimeout> | null = null;
	private readonly route: EggRoute;
	private readonly frameDuration;

	constructor(route: EggRoute, frameDuration = 1000) {
		this.route = route;
		this.frameDuration = frameDuration;

		const { side, variants } = EGG_ROUTE[route];

		this.frames = variants
			.map((v) =>
				document.querySelector<HTMLElement>(
					`[data-object="egg"][data-index="${side}"][data-variant="${v}"]`,
				),
			)
			.filter((el): el is HTMLElement => el != null);

		this.startRoll();
	}

	private showFrame(index: number) {
		const next = this.frames[index];
		if (!next) return;
		if (this.shown) conceal(this.frames[this.currentFrame]);
		reveal(next);
		if (gameEngine.isGameRunning()) eggRideSound.play();
		this.currentFrame = index;
		this.shown = true;
	}

	private nextFrame(): boolean {
		if (this.currentFrame >= this.frames.length - 1) {
			return false;
		}
		this.showFrame(this.currentFrame + 1);
		return true;
	}

	private finishRoll() {
		this.stopRoll();
		gameEngine.checkEggCatch(this.route);
	}

	private animate = () => {
		this.timerId = null;
		if (!this.nextFrame()) {
			this.finishRoll();
			return;
		}
		this.timerId = setTimeout(this.animate, this.frameDuration);
	};

	private startRoll() {
		if (this.timerId !== null || !this.frames.length) return;
		this.showFrame(0);
		this.timerId = setTimeout(this.animate, this.frameDuration);
	}

	private stopRoll() {
		if (this.shown) {
			conceal(this.frames[this.currentFrame]);
			this.shown = false;
		}
		if (this.timerId === null) return;
		clearTimeout(this.timerId);
		this.timerId = null;
	}

	destroy() {
		this.stopRoll();
		this.frames = [];
	}
}