"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound } from "lucide-react";
import { updatePasswordAction } from "@/app/(app)/profile/actions";
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

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, initialState);
  const formRef = useRef(null);
  const currentErrorId = "current-password-error";
  const newErrorId = "new-password-error";
  const confirmErrorId = "confirm-password-error";

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div className="mb-5">
        <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">Keamanan Akun</h2>
        <p className="mt-1 text-[0.78rem] text-slate-400 dark:text-muted-foreground">Masukkan password saat ini sebelum mengganti password.</p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-5">
        <FormStatus state={state} />

        <div className="space-y-1.5">
          <Label htmlFor="current-password" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
            Password Saat Ini <span className="text-red-500">*</span>
          </Label>
          <Input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-describedby={state?.fieldErrors?.currentPassword ? currentErrorId : undefined}
            aria-invalid={!!state?.fieldErrors?.currentPassword}
            className="h-10 rounded-xl border-slate-200 bg-[#F8FAFC] text-[0.9rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
          />
          <FieldError id={currentErrorId} errors={state?.fieldErrors?.currentPassword} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Password Baru <span className="text-red-500">*</span>
            </Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              aria-describedby={state?.fieldErrors?.newPassword ? newErrorId : undefined}
              aria-invalid={!!state?.fieldErrors?.newPassword}
              className="h-10 rounded-xl border-slate-200 bg-[#F8FAFC] text-[0.9rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
            />
            <FieldError id={newErrorId} errors={state?.fieldErrors?.newPassword} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
              Konfirmasi Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-describedby={state?.fieldErrors?.confirmPassword ? confirmErrorId : undefined}
              aria-invalid={!!state?.fieldErrors?.confirmPassword}
              className="h-10 rounded-xl border-slate-200 bg-[#F8FAFC] text-[0.9rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
            />
            <FieldError id={confirmErrorId} errors={state?.fieldErrors?.confirmPassword} />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" disabled={isPending} className="h-10 gap-2 bg-slate-900 px-4 text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
            {isPending ? <Spinner className="text-white" /> : <KeyRound size={16} />}
            Ganti Password
          </Button>
        </div>
      </form>
    </section>
  );
}
