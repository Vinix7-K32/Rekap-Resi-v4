export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-xl bg-slate-200" />
          <div className="h-4 w-52 rounded-lg bg-slate-100" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-slate-100" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
              <div className="h-5 w-14 rounded-full bg-slate-100" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
      </div>

      {/* Recent resi table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-8 w-24 rounded-xl bg-slate-100" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-slate-50 px-5 py-4">
            {[120, 90, 70, 80].map((w, j) => (
              <div key={j} className="h-3 rounded bg-slate-100" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
