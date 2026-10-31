import { gameEngine } from './GameEngine';

export const eggRideSound = new Audio('/sounds/egg_ride.ogg');
export const eggCatchSound = new Audio('/sounds/egg_catch.ogg');
export const eggCrackSound = new Audio('/sounds/egg_crack.ogg');

export function playIfRunning(sound: HTMLAudioElement) {
	if (gameEngine.isGameRunning()) sound.play();
}
