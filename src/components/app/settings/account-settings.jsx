import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AccountSettings({ profile }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-border dark:bg-muted/30 dark:text-muted-foreground">
            <UserRound />
          </div>
          <div>
            <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">Account</h2>
            <p className="mt-1 text-[0.82rem] text-slate-500 dark:text-muted-foreground">
              Informasi dasar akun yang sedang aktif.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="h-9 gap-2">
          <Link href="/profile">
            Buka Profil
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <Separator className="my-5" />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-border dark:bg-muted/20">
          <dt className="text-[0.78rem] font-medium text-slate-500 dark:text-muted-foreground">Nama</dt>
          <dd className="mt-1 truncate text-[0.92rem] font-semibold text-slate-800 dark:text-card-foreground">
            {profile.name}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-border dark:bg-muted/20">
          <dt className="text-[0.78rem] font-medium text-slate-500 dark:text-muted-foreground">Email</dt>
          <dd className="mt-1 truncate text-[0.92rem] font-semibold text-slate-800 dark:text-card-foreground">
            {profile.email || "-"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
