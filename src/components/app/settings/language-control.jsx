"use client";

import { useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_STORAGE_KEY = "rekapresi:language";
const DEFAULT_LANGUAGE = "id";

function getLanguageSnapshot() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage === "en" || storedLanguage === "id" ? storedLanguage : DEFAULT_LANGUAGE;
}

function subscribeLanguageChanges(onStoreChange) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("rekapresi-language-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("rekapresi-language-change", onStoreChange);
  };
}

export function LanguageControl() {
  const language = useSyncExternalStore(
    subscribeLanguageChanges,
    getLanguageSnapshot,
    () => DEFAULT_LANGUAGE
  );

  function handleLanguageChange(nextLanguage) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event("rekapresi-language-change"));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-muted/20">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-border dark:bg-card dark:text-muted-foreground">
          <Languages />
        </div>
        <div>
          <Label htmlFor="language-preference" className="text-[0.9rem] font-semibold text-slate-800 dark:text-card-foreground">
            Language
          </Label>
          <p className="mt-1 text-[0.78rem] text-slate-500 dark:text-muted-foreground">
            Preferensi UI-only sampai route i18n tersedia.
          </p>
        </div>
      </div>

      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-preference" className="h-9 w-full bg-white dark:bg-input/30">
          <SelectValue placeholder="Pilih bahasa" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="id">Indonesia</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
