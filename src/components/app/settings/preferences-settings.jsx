import { ThemeModeControl } from "./theme-mode-control";
import { LanguageControl } from "./language-control";

export function PreferencesSettings() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card">
      <div>
        <h2 className="text-[1rem] font-semibold text-slate-800 dark:text-card-foreground">Preferences</h2>
        <p className="mt-1 text-[0.82rem] text-slate-500 dark:text-muted-foreground">
          Preferensi lokal untuk tampilan dan bahasa aplikasi.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ThemeModeControl />
        <LanguageControl />
      </div>
    </section>
  );
}
