export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-xl bg-slate-200" />
          <div className="h-4 w-72 rounded-lg bg-slate-100" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-slate-100" />
      </div>

      {/* Step tracker */}
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-3 py-3.5 sm:flex-row sm:gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
            <div className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-2.5 w-14 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Two panels side-by-side */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
      </div>

      {/* Compare button area */}
      <div className="h-24 rounded-2xl border border-slate-200 bg-slate-50" />
    </div>
  );
}
