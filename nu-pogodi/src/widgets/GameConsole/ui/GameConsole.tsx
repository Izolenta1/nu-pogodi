import { Z_INDEX } from '@/shared/configs';
import { GameState } from './GameState';
import { gameEngine } from '@/entities/game';
import { useGameKeyboard } from '@/features/game-controls';

const SCREEN = 'absolute left-1/2 top-1/2 w-[48.5%] -translate-x-1/2 -translate-y-1/2';

export function GameConsole() {
	useGameKeyboard();

	return (
		<section className="relative mx-auto w-[90%] shadow-lg lg:w-[80%]">
			<img
				src="/console.png"
				alt=""
				className="relative h-auto w-full"
				style={{ zIndex: Z_INDEX.CONSOLE }}
			/>
			<div className={SCREEN}>
				<img
					src="/background.png"
					alt=""
					className="relative block h-auto w-full"
					style={{ zIndex: Z_INDEX.CONSOLE_BACKGROUND }}
				/>
				<div
					className="pointer-events-auto absolute inset-x-[3%] inset-y-[3%]"
					style={{ zIndex: Z_INDEX.CONSOLE_CONTENT }}
				>
					<GameState className="block h-full w-full" />
				</div>
				<div
					className="bg-ink/95 absolute inset-0 hidden flex-col items-center justify-center"
					data-object="result-screen"
					style={{ zIndex: Z_INDEX.GAME_RESULT }}
				>
					<p
						className="text-paper font-pixel text-4xl"
						data-object="result-screen-title"
					></p>
					<p className="text-paper font-pixel text-2xl">
						Ваш счет: <span data-object="result-screen-score"></span>
					</p>
				</div>
			</div>

			{/* Кнопки управления */}
			<div className="absolute inset-0" style={{ zIndex: Z_INDEX.CONSOLE_CONTROLS }}>
				<button
					className="absolute top-[11%] right-[10.5%] h-[7.5%] w-[6%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.startA()}
				/>
				<button
					className="absolute top-[22.5%] right-[10.5%] h-[7.5%] w-[6%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.startB()}
				/>
				<button
					className="absolute top-[33.5%] right-[10.5%] h-[7.5%] w-[6%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.idle()}
				/>
				<button
					className="absolute top-[61%] left-[8.5%] h-[12%] w-[7%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.moveWolf('leftUp', true)}
				/>
				<button
					className="absolute top-[61%] right-[8.5%] h-[12%] w-[7%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.moveWolf('rightUp', true)}
				/>
				<button
					className="absolute top-[78.5%] left-[8.5%] h-[12%] w-[7%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.moveWolf('leftDown', true)}
				/>
				<button
					className="absolute top-[78.5%] right-[8.5%] h-[12%] w-[7%] rounded-full bg-ink/0 active:bg-ink/40 hover:cursor-pointer"
					onClick={() => gameEngine.moveWolf('rightDown', true)}
				/>
			</div>
		</section>
	);
}
