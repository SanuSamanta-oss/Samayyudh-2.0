import { Navbar } from '@/components/layout/Navbar';
import { RoleGatewayListener } from '@/components/auth/RoleGatewayListener';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <RoleGatewayListener />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </>
  );
}
