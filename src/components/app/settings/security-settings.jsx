"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { PasswordForm } from "@/components/app/profile/password-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending} className="h-9 gap-2">
      {pending ? <Spinner /> : <LogOut data-icon="inline-start" />}
      Keluar
    </Button>
  );
}

export function SecuritySettings() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">Security</h2>
            <p className="mt-1 text-[0.82rem] text-slate-500 dark:text-muted-foreground">
              Perbarui password atau keluar dari sesi saat ini.
            </p>
          </div>
          <form action={logoutAction}>
            <LogoutButton />
          </form>
        </div>
      </section>

      <Separator />

      <PasswordForm />
    </div>
  );
}
