export function Header() {
	return (
		<header className="font-manrope text-ink flex w-full items-center justify-between p-3">
			<div className="flex items-center gap-3">
				<div className="border-ink rounded-full border p-1 text-lg font-bold">ИМ</div>
				<div className="text-xs font-medium">КАРМАННАЯ ЭЛЕКТРОННАЯ ИГРА</div>
			</div>

			<span className="text-xs font-medium">ИМ-02 / 1984</span>
		</header>
	);
}
