import { createClient } from './server';

/**
 * Retrieve the authenticated user from the current Supabase session.
 * Must be called inside a Server Component, Server Action, or Route Handler.
 * @returns {Promise<(import('@supabase/supabase-js').User & { sub: string }) | null>}
 */
export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return { ...data.user, sub: data.user.id };
}
