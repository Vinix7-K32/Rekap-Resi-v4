"use client";

import { MonitorCog } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeModeControl() {
  const { theme, setTheme } = useTheme();
  const selectedTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-muted/20">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-border dark:bg-card dark:text-muted-foreground">
          <MonitorCog />
        </div>
        <div>
          <Label htmlFor="theme-mode" className="text-[0.9rem] font-semibold text-slate-800 dark:text-card-foreground">
            Theme mode
          </Label>
          <p className="mt-1 text-[0.78rem] text-slate-500 dark:text-muted-foreground">
            Pilih mode terang atau gelap untuk perangkat ini.
          </p>
        </div>
      </div>

      <Select value={selectedTheme} onValueChange={setTheme}>
        <SelectTrigger id="theme-mode" className="h-9 w-full bg-white dark:bg-input/30">
          <SelectValue placeholder="Pilih theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
