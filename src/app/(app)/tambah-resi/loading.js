export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="h-9 w-9 rounded-xl bg-slate-200 shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-xl bg-slate-200" />
          <div className="h-3.5 w-64 rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex rounded-2xl p-1.5 gap-1 border border-slate-200 bg-white">
        <div className="flex-1 h-11 rounded-xl bg-slate-200" />
        <div className="flex-1 h-11 rounded-xl bg-slate-100" />
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        ))}
        <div className="h-11 w-full rounded-xl bg-slate-200 mt-2" />
      </div>

      {/* Tips box */}
      <div className="h-28 rounded-2xl bg-blue-50 border border-blue-100" />
    </div>
  );
}
