import { setVisible, setVisibleAll, querySprites } from './Helpers';

let digitSegments: Record<number, number[]> = {
	0: [0, 1, 2, 4, 5, 6],
	1: [2, 5],
	2: [0, 2, 3, 4, 6],
	3: [0, 2, 3, 5, 6],
	4: [1, 2, 3, 5],
	5: [0, 1, 3, 5, 6],
	6: [0, 1, 3, 4, 5, 6],
	7: [0, 2, 5],
	8: [0, 1, 2, 3, 4, 5, 6],
	9: [0, 1, 2, 3, 5, 6],
};

class NumberEngine {
	// База движка
	private static instance: NumberEngine;
	private initialized = false;
	private constructor() {}

	// Игра
	private firstDigit: HTMLElement[] = [];
	private secondDigit: HTMLElement[] = [];
	private thirdDigit: HTMLElement[] = [];
	private fourthDigit: HTMLElement[] = [];
	private colon: HTMLElement[] = [];
	private timePart: HTMLElement[] = [];

	static getInstance() {
		if (!NumberEngine.instance) {
			NumberEngine.instance = new NumberEngine();
		}

		return NumberEngine.instance;
	}

	init() {
		if (this.initialized) return;

		this.firstDigit = querySprites('number', { index: 0 });
		this.secondDigit = querySprites('number', { index: 1 });
		this.thirdDigit = querySprites('number', { index: 2 });
		this.fourthDigit = querySprites('number', { index: 3 });
		
		this.colon = querySprites('time', { index: 0 });
		this.timePart = querySprites('time-part');

		this.initialized = true;
	}

	// Отображение одной цифры
	private showDigit(elements: HTMLElement[], digit: number) {
		const segments = digitSegments[digit] ?? [];

		elements.forEach((element) => {
			setVisible(element, segments.includes(Number(element.dataset.variant)));
		});
	}

	// Отображение числа
	private showNumber(value: number) {
		const digits = String(value).split('').map(Number);

		const elements = [
			this.firstDigit,
			this.secondDigit,
			this.thirdDigit,
			this.fourthDigit,
		];

		// Скрываем все цифры
		elements.forEach((digit) => {
			setVisibleAll(digit, false);
		});

		// Отображаем только задействованные разряды
		const offset = elements.length - digits.length;

		digits.forEach((digit, index) => {
			const position = offset + index;

			this.showDigit(elements[position], digit);
		});
	}

	showScore(score: number) {
		if (!this.initialized) this.init();

		// Скрываем двоеточие и обозначение времени
		setVisibleAll(this.colon, false);
		setVisibleAll(this.timePart, false);

		// Первая цифра всегда единица
		setVisibleAll(this.firstDigit, true);

		// Показываем счет
		this.showNumber(score);
	}

	showTime() {
		if (!this.initialized) this.init();

		const now = new Date();

		let hours = now.getHours();
		const minutes = now.getMinutes();

		// Определяем AM / PM
		const isPM = hours >= 12;

		// Переводим часы в 12-часовой формат
		hours = hours % 12 || 12;

		// Получаем цифры времени
		const digits = [
			Math.floor(hours / 10),
			hours % 10,
			Math.floor(minutes / 10),
			minutes % 10,
		];

		// Отображаем часы и минуты
		setVisibleAll(this.firstDigit, digits[0] === 1);

		this.showDigit(this.secondDigit, digits[1]);
		this.showDigit(this.thirdDigit, digits[2]);
		this.showDigit(this.fourthDigit, digits[3]);

		// Показываем двоеточие
		setVisibleAll(this.colon, true);

		// Показываем AM / PM
		setVisibleAll(this.timePart, true);

		// Индекс 0 — AM, индекс 1 — PM
		setVisible(this.timePart[0], !isPM);
		setVisible(this.timePart[1], isPM);
	}
}

export const numberEngine = NumberEngine.getInstance();
