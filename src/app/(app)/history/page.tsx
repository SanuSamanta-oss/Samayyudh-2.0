import { History as HistoryIcon } from 'lucide-react';
export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground">History</h1>
      <p className="text-stone-500 mt-1">Your past exam sessions</p>
      <div className="mt-8 text-center py-16">
        <HistoryIcon className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500">No sessions yet. Complete an exam to see it here.</p>
      </div>
    </div>
  );
}
