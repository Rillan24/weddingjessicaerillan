UPDATE public.gifts AS gifts
SET
  title = updates.title,
  description = NULL,
  price = updates.price,
  sort_order = updates.sort_order
FROM (
  VALUES
    (1, '🍷 Jantar romântico dos recém-casados', 200.00::numeric),
    (2, '🥂 Experiência especial da lua de mel', 250.00::numeric),
    (3, '🏨 Ajude com nossa hospedagem', 300.00::numeric),
    (4, '🏖️ Passeio especial do casal', 350.00::numeric),
    (5, '✈️ Ajude nas passagens', 400.00::numeric),
    (6, '❤️ Uma diária especial da nossa lua de mel', 500.00::numeric)
) AS updates(sort_order, title, price)
WHERE gifts.sort_order = updates.sort_order;
