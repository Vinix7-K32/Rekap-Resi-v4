export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-xl bg-slate-200" />
          <div className="h-4 w-64 rounded-lg bg-slate-100" />
        </div>
        <div className="h-8 w-32 rounded-xl bg-slate-100" />
      </div>

      {/* Main content block */}
      <div className="h-12 w-full rounded-xl bg-slate-100" />
      <div className="space-y-3">
        <div className="h-96 w-full rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
