export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-xl bg-slate-200" />
        <div className="h-4 w-80 rounded-lg bg-slate-100" />
      </div>

      {/* Tab selector */}
      <div className="flex h-10 rounded-xl gap-1 bg-slate-100 px-1">
        <div className="flex-1 my-1 rounded-lg bg-slate-200" />
        <div className="flex-1 my-1 rounded-lg bg-slate-100" />
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
