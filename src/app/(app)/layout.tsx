import { Navbar } from '@/components/layout/Navbar';
import { HauntedWebIntro } from '@/components/effects/HauntedWebIntro';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HauntedWebIntro />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </>
  );
}
