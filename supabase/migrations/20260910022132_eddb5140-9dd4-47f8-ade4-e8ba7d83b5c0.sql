delete from public.gifts;

insert into public.gifts (title, description, price, sort_order) values
('✈️ Uma experiência para a nossa Lua de Mel', null, 500, 1),
('🍟 Air Fryer para nossa casa', null, 320, 2),
('🛋️ Um detalhe especial para o nosso sofá', null, 450, 3),
('🍳 Jogo de panelas premium', null, 370, 4),
('🏨 Uma diária especial na Lua de Mel', null, 500, 5),
('🛏️ Edredom + enxoval do casal', null, 380, 6),
('🍽️ Aparelho de jantar completo', null, 420, 7),
('☕ Cafeteira para nossos cafés juntos', null, 250, 8),
('🧺 Nossa máquina de lavar', null, 430, 9),
('🍷 Jantar romântico dos recém-casados', null, 350, 10),
('📺 Um novo capítulo para a nossa sala', null, 480, 11),
('🍲 Panela de pressão elétrica', null, 350, 12),
('🏠 Um toque especial para o nosso lar', null, 400, 13),
('🍽️ Jogo de jantar para nossa casa', null, 230, 14),
('🍖 Churrasqueira para nossa casa', null, 390, 15),
('🧹 Aspirador de pó', null, 330, 16),
('❤️ Presente especial para os noivos', null, 500, 17),
('🛏️ Jogo de cama premium', null, 280, 18),
('🪑 Mesa de jantar para a nossa casa', null, 400, 19),
('🥂 Kit de taças para momentos especiais', null, 200, 20),
('❄️ Um novo conforto para a nossa cozinha', null, 450, 21),
('🥤 Liquidificador para nossa cozinha', null, 300, 22);

create table if not exists public.gift_payments (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  giver_name text not null,
  giver_phone text not null,
  amount numeric not null,
  preference_id text,
  payment_id text unique,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists gift_payments_gift_id_idx on public.gift_payments (gift_id);
create index if not exists gift_payments_created_at_idx on public.gift_payments (created_at desc);

grant all on public.gift_payments to service_role;

alter table public.gift_payments enable row level security;

create policy "Admins can read gift payments"
  on public.gift_payments for select to authenticated
  using (public.has_role(auth.uid(), 'admin'::app_role));

alter table public.gifts replica identity full;
alter publication supabase_realtime add table public.gifts;