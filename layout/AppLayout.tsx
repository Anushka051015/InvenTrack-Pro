import { ReactNode } from 'react';
import { MainNavigation } from './MainNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background hero-pattern">
      <MainNavigation />
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}