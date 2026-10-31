import { GameConsole } from '@/widgets/GameConsole';
import { gameEngine } from '@/entities/game';
import { useEffect } from 'react';

export function MainPage() {
	useEffect(() => {
		gameEngine.init();
	}, []);

	return (
		<div className="flex flex-1 flex-col gap-4 pt-6">
			<GameConsole />

			<div className="font-manrope text-ink flex flex-col items-center gap-2 self-center">
				<p>Управление с клавиатуры</p>
				<div className="flex items-center gap-2">
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						Q
					</div>
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						E
					</div>
					<p>Верхние кнопки</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						A
					</div>
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						D
					</div>
					<p>Нижние кнопки</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						1
					</div>
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						2
					</div>
					<div className="bg-paper flex aspect-square h-6 w-6 items-center justify-center rounded-sm shadow">
						3
					</div>
					<p>Режимы приставки</p>
				</div>
			</div>
		</div>
	);
}
