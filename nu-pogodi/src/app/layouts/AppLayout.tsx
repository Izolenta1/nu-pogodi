import type { ReactNode } from 'react';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';

type AppLayoutProps = {
	children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex min-h-screen w-full max-w-300 flex-col">
			<Header />

			<main className="flex min-h-0 flex-1 flex-col">{children}</main>

			<Footer />
		</div>
	);
}
