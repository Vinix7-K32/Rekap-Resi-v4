import { redirect } from "next/navigation";
import { ProfilePage } from "@/components/app/profile/profile-page";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/server";

const AVATAR_BUCKET = "avatars";
const AVATAR_SIGNED_URL_TTL = 60 * 60;

async function getSignedAvatarUrl(avatarPath) {
  if (!avatarPath) return "";

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, AVATAR_SIGNED_URL_TTL);

  if (error) {
    return "";
  }

  return data?.signedUrl ?? "";
}

async function normalizeProfile(user) {
  const metadata = user?.user_metadata ?? {};
  const name = metadata.name || metadata.full_name || user?.email?.split("@")[0] || "User";
  const role = user?.app_metadata?.role ?? "User";
  const signedAvatarUrl = await getSignedAvatarUrl(metadata.avatar_path);

  return {
    id: user?.id ?? user?.sub ?? "",
    name,
    email: user?.email ?? "",
    role,
    avatarUrl: signedAvatarUrl || metadata.picture || "",
    phone: metadata.phone || "",
  };
}

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ProfilePage profile={await normalizeProfile(user)} />;
}
