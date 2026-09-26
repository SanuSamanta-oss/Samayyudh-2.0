import { User } from 'lucide-react';
import Link from 'next/link';
export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">S</div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Student</h2>
          <p className="text-sm text-stone-500">Local account — sign in to sync your data</p>
        </div>
      </div>
      <Link href="/auth" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity">
        Sign In to Save Progress
      </Link>
    </div>
  );
}
