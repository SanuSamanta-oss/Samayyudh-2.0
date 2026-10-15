import { Navbar } from '@/components/layout/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </>
  );
}
