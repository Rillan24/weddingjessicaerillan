CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  attending BOOLEAN NOT NULL DEFAULT true,
  guests INTEGER NOT NULL DEFAULT 0,
  dietary TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an rsvp" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can read rsvps" ON public.rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update rsvps" ON public.rsvps FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete rsvps" ON public.rsvps FOR DELETE TO authenticated USING (true);

CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  claimed_by TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gifts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;
GRANT ALL ON public.gifts TO service_role;

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gifts" ON public.gifts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert gifts" ON public.gifts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update gifts" ON public.gifts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete gifts" ON public.gifts FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.claim_gift(_gift_id UUID, _name TEXT)
RETURNS public.gifts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.gifts;
BEGIN
  IF _name IS NULL OR length(btrim(_name)) = 0 THEN
    RAISE EXCEPTION 'Informe seu nome';
  END IF;

  UPDATE public.gifts
     SET claimed_by = btrim(_name), claimed_at = now()
   WHERE id = _gift_id AND claimed_by IS NULL
  RETURNING * INTO result;

  IF result.id IS NULL THEN
    RAISE EXCEPTION 'Presente indisponivel';
  END IF;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_gift(UUID, TEXT) TO anon, authenticated;

INSERT INTO public.gifts (title, description, price, sort_order) VALUES
  ('Jantar romântico na lua de mel', 'Um jantar à beira-mar para o casal em Trancoso.', 350.00, 1),
  ('Passeio de barco ao pôr do sol', 'Uma tarde inesquecível navegando juntos.', 420.00, 2),
  ('Jogo de panelas', 'Para os primeiros almoços de domingo em casa.', 690.00, 3),
  ('Cafeteira italiana', 'O café da manhã dos nossos dias preguiçosos.', 240.00, 4),
  ('Roupa de cama premium', 'Porque descanso bom também é presente.', 520.00, 5),
  ('Cota livre — o valor que você quiser', 'Contribua com qualquer valor via PIX.', NULL, 6);