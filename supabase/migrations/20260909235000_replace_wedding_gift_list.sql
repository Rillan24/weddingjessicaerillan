-- Align the public gift list with the couple's requested order and values.
WITH requested(sort_order, title, price) AS (
  VALUES
    (1, '✈️ Ajuda para nossa Lua de Mel', 500.00::numeric),
    (2, '🍟 Air Fryer para nossa casa', 320.00::numeric),
    (3, '🛋️ Ajuda para nosso sofá', 450.00::numeric),
    (4, '🍳 Jogo de panelas premium', 370.00::numeric),
    (5, '🏨 Uma diária especial na Lua de Mel', 500.00::numeric),
    (6, '🛏️ Edredom + enxoval do casal', 380.00::numeric),
    (7, '🍽️ Aparelho de jantar completo', 420.00::numeric),
    (8, '☕ Cafeteira para nossos cafés juntos', 250.00::numeric),
    (9, '🧺 Ajuda para nossa máquina de lavar', 430.00::numeric),
    (10, '🍷 Jantar romântico dos recém-casados', 350.00::numeric),
    (11, '📺 Ajuda para nossa TV', 480.00::numeric),
    (12, '🍲 Panela de pressão elétrica', 350.00::numeric),
    (13, '🏠 Ajuda para decorar nosso lar', 400.00::numeric),
    (14, '🍽️ Jogo de jantar para nossa casa', 230.00::numeric),
    (15, '🍖 Churrasqueira para nossa casa', 390.00::numeric),
    (16, '🧹 Aspirador de pó', 330.00::numeric),
    (17, '❤️ Presente especial para os noivos', 500.00::numeric),
    (18, '🛏️ Jogo de cama premium', 280.00::numeric),
    (19, '🪑 Ajuda para nossa mesa de jantar', 400.00::numeric),
    (20, '🥂 Kit de taças para momentos especiais', 200.00::numeric),
    (21, '❄️ Ajuda para nossa geladeira', 450.00::numeric),
    (22, '🥤 Liquidificador para nossa cozinha', 300.00::numeric)
)
UPDATE public.gifts AS gifts
SET title = requested.title,
    description = NULL,
    price = requested.price,
    image_url = NULL,
    sort_order = requested.sort_order
FROM requested
WHERE gifts.sort_order = requested.sort_order;

WITH requested(sort_order, title, price) AS (
  VALUES
    (1, '✈️ Ajuda para nossa Lua de Mel', 500.00::numeric),
    (2, '🍟 Air Fryer para nossa casa', 320.00::numeric),
    (3, '🛋️ Ajuda para nosso sofá', 450.00::numeric),
    (4, '🍳 Jogo de panelas premium', 370.00::numeric),
    (5, '🏨 Uma diária especial na Lua de Mel', 500.00::numeric),
    (6, '🛏️ Edredom + enxoval do casal', 380.00::numeric),
    (7, '🍽️ Aparelho de jantar completo', 420.00::numeric),
    (8, '☕ Cafeteira para nossos cafés juntos', 250.00::numeric),
    (9, '🧺 Ajuda para nossa máquina de lavar', 430.00::numeric),
    (10, '🍷 Jantar romântico dos recém-casados', 350.00::numeric),
    (11, '📺 Ajuda para nossa TV', 480.00::numeric),
    (12, '🍲 Panela de pressão elétrica', 350.00::numeric),
    (13, '🏠 Ajuda para decorar nosso lar', 400.00::numeric),
    (14, '🍽️ Jogo de jantar para nossa casa', 230.00::numeric),
    (15, '🍖 Churrasqueira para nossa casa', 390.00::numeric),
    (16, '🧹 Aspirador de pó', 330.00::numeric),
    (17, '❤️ Presente especial para os noivos', 500.00::numeric),
    (18, '🛏️ Jogo de cama premium', 280.00::numeric),
    (19, '🪑 Ajuda para nossa mesa de jantar', 400.00::numeric),
    (20, '🥂 Kit de taças para momentos especiais', 200.00::numeric),
    (21, '❄️ Ajuda para nossa geladeira', 450.00::numeric),
    (22, '🥤 Liquidificador para nossa cozinha', 300.00::numeric)
)
INSERT INTO public.gifts (title, description, price, image_url, sort_order)
SELECT requested.title, NULL, requested.price, NULL, requested.sort_order
FROM requested
WHERE NOT EXISTS (
  SELECT 1 FROM public.gifts AS gifts WHERE gifts.sort_order = requested.sort_order
);
