export function Header() {
	return (
		<header className="w-full flex justify-between items-center font-manrope text-ink p-3">
			<div className="flex items-center gap-3">
				<div className="text-lg font-bold p-1 border border-ink rounded-full">ИМ</div>
				<div className="text-xs font-medium">КАРМАННАЯ ЭЛЕКТРОННАЯ ИГРА</div>
			</div>

			<span className="text-xs font-medium">ИМ-02 / 1984</span>
		</header>
	);
}