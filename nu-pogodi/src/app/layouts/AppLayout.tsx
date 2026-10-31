import type { ReactNode } from 'react';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';

type AppLayoutProps = {
	children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="w-full max-w-300 flex flex-col min-h-screen">
			<Header />

			<main className="flex-1 flex flex-col min-h-0">{children}</main>

			<Footer />
		</div>
	);
}