import { GameConsole } from '@/widgets/GameConsole';
import { gameEngine } from '@/entities/game';
import { useEffect } from 'react';

export function MainPage() {
	useEffect(() => {
		gameEngine.init();
	}, []);

	return (
		<div className="flex-1 pt-6 flex flex-col gap-4">
			<GameConsole />
			
			<div className="self-center flex flex-col items-center gap-2 font-manrope text-ink">
				<p>Управление с клавиатуры</p>
				<div className="flex gap-2 items-center">
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">Q</div>
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">E</div>
					<p>Верхние кнопки</p>
				</div>
				<div className="flex gap-2 items-center">
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">A</div>
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">D</div>
					<p>Нижние кнопки</p>
				</div>
				<div className="flex gap-2 items-center">
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">1</div>
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">2</div>
					<div className="shadow w-6 h-6 flex items-center justify-center bg-paper rounded-sm aspect-square">3</div>
					<p>Режимы приставки</p>
				</div>
			</div>
		</div>
	);
}