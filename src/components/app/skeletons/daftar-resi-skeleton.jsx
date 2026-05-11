export function DaftarResiSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-xl bg-slate-200" />
          <div className="h-4 w-56 rounded-lg bg-slate-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-xl bg-slate-100" />
          <div className="h-8 w-28 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Tabs */}
      <div className="h-10 w-64 rounded-xl bg-slate-200" />

      {/* Search bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <div className="h-10 flex-1 rounded-xl bg-slate-100" />
          <div className="h-10 w-24 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Table header */}
        <div className="flex gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          {[40, 120, 90, 80, 90, 80, 60].map((w, i) => (
            <div key={i} className="h-3 rounded bg-slate-200" style={{ width: w }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-slate-50 px-5 py-4">
            {[40, 120, 90, 80, 90, 70, 50].map((w, j) => (
              <div key={j} className="h-3 rounded bg-slate-100" style={{ width: w }} />
            ))}
          </div>
        ))}
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <div className="h-4 w-32 rounded bg-slate-100" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
