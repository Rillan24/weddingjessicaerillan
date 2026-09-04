DROP FUNCTION IF EXISTS public.claim_gift(uuid, text);

GRANT UPDATE (claimed_by, claimed_at) ON public.gifts TO anon, authenticated;

CREATE POLICY "Guests can claim an unclaimed gift"
ON public.gifts
FOR UPDATE
TO anon, authenticated
USING (claimed_by IS NULL)
WITH CHECK (claimed_by IS NOT NULL AND length(btrim(claimed_by)) > 0);