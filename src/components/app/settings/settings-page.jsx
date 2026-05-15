"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AccountSettings } from "./account-settings";
import { AppInfo } from "./app-info";
import { PreferencesSettings } from "./preferences-settings";
import { SecuritySettings } from "./security-settings";

const SETTINGS_TABS = [
  { value: "account", label: "Account" },
  { value: "security", label: "Security" },
  { value: "preferences", label: "Preferences" },
  { value: "about", label: "About" },
];

export function SettingsPage({ profile, appInfo }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[1.5rem] font-bold text-slate-800 dark:text-foreground">Settings</h1>
        <p className="mt-1 text-[0.9rem] text-slate-500 dark:text-muted-foreground">
          Kelola akun, keamanan login, preferensi tampilan, dan informasi aplikasi.
        </p>
      </div>

      <Tabs defaultValue="account" className="gap-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto sm:w-fit">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="min-w-24 px-3 py-1.5">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account">
          <AccountSettings profile={profile} />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>
        <TabsContent value="about">
          <AppInfo appInfo={appInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
