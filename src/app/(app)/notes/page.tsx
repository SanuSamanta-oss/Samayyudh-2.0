import { StickyNote } from 'lucide-react';
export default function NotesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground">Notes</h1>
      <p className="text-stone-500 mt-1">Your sticky notes from exam sessions</p>
      <div className="mt-8 text-center py-16">
        <StickyNote className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500">No notes yet. Jot down ideas during your exams.</p>
      </div>
    </div>
  );
}
