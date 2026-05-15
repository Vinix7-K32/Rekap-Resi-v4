import { redirect } from "next/navigation";
import { SettingsPage } from "@/components/app/settings/settings-page";
import { getAppInfo } from "@/lib/app-info";
import { getUser } from "@/lib/auth";

function normalizeProfile(user) {
  const metadata = user?.user_metadata ?? {};
  const name = metadata.name || metadata.full_name || user?.email?.split("@")[0] || "User";

  return {
    id: user?.id ?? user?.sub ?? "",
    name,
    email: user?.email ?? "",
  };
}

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsPage profile={normalizeProfile(user)} appInfo={getAppInfo()} />;
}
