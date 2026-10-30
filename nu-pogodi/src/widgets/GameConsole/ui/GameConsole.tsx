import { Z_INDEX } from '@/shared/configs';
import { GameState } from '@/GameState';

const SCREEN = 'absolute left-1/2 top-1/2 w-[48.5%] -translate-x-1/2 -translate-y-1/2';

export function GameConsole() {
	return (
		<section className="relative w-[90%] lg:w-[75%]">
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
			</div>
		</section>
	);
}
