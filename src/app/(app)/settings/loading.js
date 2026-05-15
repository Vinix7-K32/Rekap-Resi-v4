import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-28" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-border dark:bg-card">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-border dark:bg-card">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-3 h-4 w-full max-w-lg" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="mt-6 h-9 w-32" />
        </div>
      </div>
    </div>
  );
}
