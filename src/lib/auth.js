import { createClient } from './server';

/**
 * Retrieve the authenticated user's claims from the current Supabase session.
 * Must be called inside a Server Component, Server Action, or Route Handler.
 * @returns {Promise<import('@supabase/supabase-js').JWTPayload | null>}
 */
export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
