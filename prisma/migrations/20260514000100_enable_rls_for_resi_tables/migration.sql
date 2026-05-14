-- Harden Supabase Data API access for Prisma-managed user data tables.
-- Do not FORCE RLS here: the existing server-side Prisma connection should keep
-- its current behavior, while browser/Data API roles are constrained by policy.

ALTER TABLE public.resi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_resi ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.resi FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.marketplace_resi FROM anon;

DROP POLICY IF EXISTS "Users can read their own resi" ON public.resi;
CREATE POLICY "Users can read their own resi"
  ON public.resi
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own resi" ON public.resi;
CREATE POLICY "Users can insert their own resi"
  ON public.resi
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own resi" ON public.resi;
CREATE POLICY "Users can update their own resi"
  ON public.resi
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own resi" ON public.resi;
CREATE POLICY "Users can delete their own resi"
  ON public.resi
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read their own marketplace resi" ON public.marketplace_resi;
CREATE POLICY "Users can read their own marketplace resi"
  ON public.marketplace_resi
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own marketplace resi" ON public.marketplace_resi;
CREATE POLICY "Users can insert their own marketplace resi"
  ON public.marketplace_resi
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own marketplace resi" ON public.marketplace_resi;
CREATE POLICY "Users can update their own marketplace resi"
  ON public.marketplace_resi
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own marketplace resi" ON public.marketplace_resi;
CREATE POLICY "Users can delete their own marketplace resi"
  ON public.marketplace_resi
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);
