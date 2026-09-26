import { BarChart3 } from 'lucide-react';
export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      <p className="text-stone-500 mt-1">Your performance insights</p>
      <div className="mt-8 text-center py-16">
        <BarChart3 className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500">Complete exams to see your analytics and time efficiency reports.</p>
      </div>
    </div>
  );
}
