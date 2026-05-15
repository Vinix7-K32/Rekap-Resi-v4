"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateProfileAction } from "@/app/(app)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  success: false,
  error: "",
  message: "",
  fieldErrors: {},
};

function FieldError({ id, errors }) {
  if (!errors?.length) return null;

  return (
    <p id={id} className="text-[0.78rem] text-red-600 dark:text-red-300">
      {errors[0]}
    </p>
  );
}

function FormStatus({ state }) {
  if (!state?.error && !state?.message) return null;

  return (
    <div
      aria-live="polite"
      className={`rounded-xl border px-4 py-3 text-[0.85rem] ${
        state.error
          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
      }`}
    >
      {state.error || state.message}
    </div>
  );
}

export function ProfileForm({ profile }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  const nameErrorId = "profile-name-error";
  const phoneErrorId = "profile-phone-error";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div className="mb-5">
        <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">Informasi Profil</h2>
        <p className="mt-1 text-[0.78rem] text-slate-400 dark:text-muted-foreground">Nama dan nomor telepon disimpan di metadata akun.</p>
      </div>

      <form action={formAction} className="space-y-5">
        <FormStatus state={state} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="profile-name"
              name="name"
              defaultValue={profile.name}
              aria-describedby={state?.fieldErrors?.name ? nameErrorId : undefined}
              aria-invalid={!!state?.fieldErrors?.name}
              className="h-10 rounded-xl border-slate-200 bg-[#F8FAFC] text-[0.9rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
            />
            <FieldError id={nameErrorId} errors={state?.fieldErrors?.name} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Nomor Telepon
            </Label>
            <Input
              id="profile-phone"
              name="phone"
              defaultValue={profile.phone}
              placeholder="+62 812-3456-7890"
              aria-describedby={state?.fieldErrors?.phone ? phoneErrorId : undefined}
              aria-invalid={!!state?.fieldErrors?.phone}
              className="h-10 rounded-xl border-slate-200 bg-[#F8FAFC] text-[0.9rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
            />
            <FieldError id={phoneErrorId} errors={state?.fieldErrors?.phone} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Email
            </Label>
            <Input
              id="profile-email"
              value={profile.email}
              readOnly
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-[0.9rem] text-slate-500 dark:border-input dark:bg-muted/30 dark:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-role" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Role / Jabatan
            </Label>
            <Input
              id="profile-role"
              value={profile.role}
              readOnly
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-[0.9rem] text-slate-500 dark:border-input dark:bg-muted/30 dark:text-muted-foreground"
            />
            <p className="text-[0.75rem] text-slate-400 dark:text-muted-foreground">Role hanya ditampilkan dan tidak disimpan dari form ini.</p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" disabled={isPending} className="h-10 gap-2 bg-blue-600 px-4 text-white hover:bg-blue-700">
            {isPending ? <Spinner className="text-white" /> : <Save size={16} />}
            Simpan Profil
          </Button>
        </div>
      </form>
    </section>
  );
}
