import { Z_INDEX } from '@/shared/configs';
import { GameState } from './GameState';
import { gameEngine } from '@/entities/game';
import { useGameKeyboard } from '@/features/game-controls';

const SCREEN = 'absolute left-1/2 top-1/2 w-[48.5%] -translate-x-1/2 -translate-y-1/2';

export function GameConsole() {
	useGameKeyboard();
	
	return (
		<section className="relative w-[90%] lg:w-[80%] mx-auto shadow-lg">
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
				<div className="absolute inset-0 bg-ink/95 flex-col items-center justify-center hidden" data-object="result-screen" style={{ zIndex: Z_INDEX.GAME_RESULT }}>
					<p className="text-paper text-4xl font-pixel" data-object="result-screen-title"></p>
					<p className="text-paper text-2xl font-pixel">Ваш счет: <span data-object="result-screen-score"></span></p>
				</div>
			</div>

			{/* Кнопки управления */}
			<div className="absolute inset-0" style={{ zIndex: Z_INDEX.CONSOLE_CONTROLS }}>
				<button className="absolute right-[10.5%] top-[11%] w-[6%] h-[7.5%] rounded-full opacity-50" onClick={() => gameEngine.startA()} />
				<button className="absolute right-[10.5%] top-[22.5%] w-[6%] h-[7.5%] rounded-full opacity-50" onClick={() => gameEngine.startB()} />
				<button className="absolute right-[10.5%] top-[33.5%] w-[6%] h-[7.5%] rounded-full opacity-50" onClick={() => gameEngine.idle()} />
				<button className="absolute left-[8.5%] top-[61%] w-[7%] h-[12%] rounded-full opacity-50" onClick={() => gameEngine.moveWolf("leftUp", true)} />
				<button className="absolute right-[8.5%] top-[61%] w-[7%] h-[12%] rounded-full opacity-50" onClick={() => gameEngine.moveWolf("rightUp", true)} />
				<button className="absolute left-[8.5%] top-[78.5%] w-[7%] h-[12%] rounded-full opacity-50" onClick={() => gameEngine.moveWolf("leftDown", true)} />
				<button className="absolute right-[8.5%] top-[78.5%] w-[7%] h-[12%] rounded-full opacity-50" onClick={() => gameEngine.moveWolf("rightDown", true)} />
			</div>
		</section>
	);
}
