import { TriangleAlert } from 'lucide-react';

export function TestnetBanner() {
  return (
    <div
      role="note"
      className="flex items-center justify-center gap-2 bg-warning px-4 py-2 text-center text-xs font-medium text-warning-foreground"
    >
      <TriangleAlert className="size-4 shrink-0" aria-hidden />
      Учебный проект. Только тестовые сети — не используйте реальные средства.
    </div>
  );
}
