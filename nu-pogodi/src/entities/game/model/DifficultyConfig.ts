export type DifficultyConfig = {
	spawnDuration: number;
	eggFrameDuration: number;
};

export const DIFFICULTY_CONFIG: Record<'startA' | 'startB', DifficultyConfig[]> = {
	startA: [
		// 0–49 очков
		{
			spawnDuration: 3000,
			eggFrameDuration: 1200,
		},

		// 50–99 очков
		{
			spawnDuration: 2500,
			eggFrameDuration: 1000,
		},

		// 100+ очков (максимальная сложность startA)
		{
			spawnDuration: 2000,
			eggFrameDuration: 800,
		},
	],

	startB: [
		// 0–49 очков
		{
			spawnDuration: 2000,
			eggFrameDuration: 1000,
		},

		// 50–99 очков
		{
			spawnDuration: 1700,
			eggFrameDuration: 800,
		},

		// 100–149 очков
		{
			spawnDuration: 1400,
			eggFrameDuration: 650,
		},

		// 150+ очков (максимальная сложность startB)
		{
			spawnDuration: 1100,
			eggFrameDuration: 500,
		},
	],
};
