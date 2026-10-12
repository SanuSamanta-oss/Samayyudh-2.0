import { Navbar } from '@/components/layout/Navbar';
import { SokhaWidget } from '@/components/sokha/SokhaWidget';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <SokhaWidget />
    </>
  );
}
