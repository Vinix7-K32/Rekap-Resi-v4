import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AppInfo({ appInfo }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-border dark:bg-muted/30 dark:text-muted-foreground">
          <Info />
        </div>
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">About</h2>
          <p className="mt-1 text-[0.82rem] text-slate-500 dark:text-muted-foreground">
            Informasi versi aplikasi dari package proyek.
          </p>
        </div>
      </div>

      <Separator className="my-5" />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-border dark:bg-muted/20">
          <dt className="text-[0.78rem] font-medium text-slate-500 dark:text-muted-foreground">Aplikasi</dt>
          <dd className="mt-1 text-[0.92rem] font-semibold text-slate-800 dark:text-card-foreground">{appInfo.name}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-border dark:bg-muted/20">
          <dt className="text-[0.78rem] font-medium text-slate-500 dark:text-muted-foreground">Package</dt>
          <dd className="mt-1 truncate text-[0.92rem] font-semibold text-slate-800 dark:text-card-foreground">
            {appInfo.packageName}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-border dark:bg-muted/20">
          <dt className="text-[0.78rem] font-medium text-slate-500 dark:text-muted-foreground">Version</dt>
          <dd className="mt-1 font-mono text-[0.92rem] font-semibold text-slate-800 dark:text-card-foreground">
            {appInfo.version}
          </dd>
        </div>
      </dl>
    </section>
  );
}
