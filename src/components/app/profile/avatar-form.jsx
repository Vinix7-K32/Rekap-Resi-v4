"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { avatarUploadAction } from "@/app/(app)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  success: false,
  error: "",
  message: "",
  avatarUrl: "",
  fieldErrors: {},
};

function getInitials(name, email) {
  const source = name || email || "User";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

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

export function AvatarForm({ profile }) {
  const [state, formAction, isPending] = useActionState(avatarUploadAction, initialState);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState("");
  const initials = getInitials(profile.name, profile.email);
  const currentAvatarUrl = state?.avatarUrl || profile.avatarUrl;
  const showAvatarImage = currentAvatarUrl && failedAvatarUrl !== currentAvatarUrl;
  const avatarErrorId = "profile-avatar-error";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {showAvatarImage ? (
            // Plain img avoids adding remotePatterns to next.config for Supabase Storage avatars.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentAvatarUrl}
              alt={`Avatar ${profile.name}`}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-[0_8px_30px_rgba(15,23,42,0.12)] dark:border-card"
              onError={() => setFailedAvatarUrl(currentAvatarUrl)}
            />
          ) : (
            <div
              role="img"
              aria-label={`Inisial ${profile.name}`}
              className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-600 text-[2rem] font-bold text-white shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
            >
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-500 dark:border-card dark:bg-muted dark:text-muted-foreground">
            <ImagePlus size={16} />
          </div>
        </div>

        <h2 className="mt-4 text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">{profile.name}</h2>
        <p className="mt-1 max-w-full truncate text-[0.82rem] text-slate-500 dark:text-muted-foreground">{profile.email}</p>
        <span className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-[0.76rem] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {profile.role}
        </span>

        <form action={formAction} className="mt-6 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-muted/20">
          <Upload size={20} className="mx-auto text-slate-400 dark:text-muted-foreground" />
          <div className="mt-3 space-y-4 text-left">
            <FormStatus state={state} />

            <div className="space-y-1.5">
              <Label htmlFor="profile-avatar" className="text-[0.85rem] font-semibold text-slate-700 dark:text-card-foreground">
                Upload avatar <span className="text-red-500">*</span>
              </Label>
              <Input
                id="profile-avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isPending}
                aria-describedby={state?.fieldErrors?.avatar ? avatarErrorId : "profile-avatar-help"}
                aria-invalid={!!state?.fieldErrors?.avatar}
                className="h-10 cursor-pointer rounded-xl border-slate-200 bg-white text-[0.85rem] text-slate-700 dark:border-input dark:bg-input/30 dark:text-foreground"
              />
              <p id="profile-avatar-help" className="text-[0.75rem] text-slate-400 dark:text-muted-foreground">
                JPG, PNG, atau WebP. Maksimal 2 MB.
              </p>
              <FieldError id={avatarErrorId} errors={state?.fieldErrors?.avatar} />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="mt-4 h-9 w-full gap-2 bg-blue-600 text-white hover:bg-blue-700">
            {isPending ? <Spinner className="text-white" /> : <Upload size={16} />}
            {isPending ? "Mengupload..." : "Upload Avatar"}
          </Button>
        </form>
      </div>
    </section>
  );
}
