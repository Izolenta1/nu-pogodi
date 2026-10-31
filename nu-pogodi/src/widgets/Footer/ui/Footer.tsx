export function Footer() {
	return (
		<footer className="font-manrope text-ink w-full px-3 pt-8 pb-6">
			<div className="bg-paper mx-auto flex w-[90%] flex-col gap-3 rounded-lg p-5 shadow-lg lg:w-[80%]">
				<h2 className="text-xs font-bold">ИГРА</h2>
				<p className="text-sm">
					Волк стоит у одного из четырёх гнёзд. Яйцо скатывается по жёлобу. Необходимо подставить
					корзину под то гнездо, откуда оно едет.
				</p>
				<p className="text-sm">
					Пойманное яйцо даёт 1 очко. Пока на экране заяц, то же яйцо стоит 2 очка. Заработав 1000 очков, вы выиграете.
				</p>
				<p className="text-sm">
					Промах разбивает яйцо. Четвёртый промах заканчивает партию. Чем выше счёт, тем
					чаще появляются яйца и тем быстрее они катятся.
				</p>
			</div>
		</footer>
	);
}
