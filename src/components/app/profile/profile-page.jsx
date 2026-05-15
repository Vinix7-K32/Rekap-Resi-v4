"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { AvatarForm } from "./avatar-form";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

export function ProfilePage({ profile }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.5rem] font-bold text-slate-800 dark:text-foreground">Profil Saya</h1>
          <p className="mt-1 text-[0.9rem] text-slate-500 dark:text-muted-foreground">
            Kelola informasi akun dan keamanan login.
          </p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="h-10 gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40">
            <LogOut size={16} />
            Keluar
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
        <AvatarForm profile={profile} />
        <div className="space-y-5">
          <ProfileForm profile={profile} />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
