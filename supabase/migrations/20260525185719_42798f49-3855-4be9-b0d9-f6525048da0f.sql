-- Delete previous test products for this brand to avoid clutter
DELETE FROM public.products WHERE brand_id = '19563f2c-3987-4fb8-914f-f7fe9dc44e36';

-- Seed High-Quality Real-Style Products
INSERT INTO public.products (id, brand_id, name, description, price, commission_value, category, image_url, active)
VALUES 
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'iPhone 15 Pro Max - 256GB', 'O iPhone mais poderoso com titânio e chip A17 Pro.', 8499.00, 425.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Perfume Bleu de Chanel', 'Fragrância amadeirada e aromática para o homem moderno.', 890.00, 133.50, 'Beleza', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Tênis Nike Air Jordan 1 High', 'O clássico atemporal que nunca sai de moda.', 1299.90, 195.00, 'Moda', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'MacBook Air M2 13"', 'Superfino, super-rápido e com bateria para o dia todo.', 7200.00, 360.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Câmera Sony A7 IV', 'Perfeição híbrida para fotos e vídeos profissionais.', 18500.00, 925.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', true);

-- Seed Campaigns for these products to show on the Brand/Affiliate panels
INSERT INTO public.campaigns (brand_id, product_id, name, description, bonus_percentage, status)
SELECT 
  '19563f2c-3987-4fb8-914f-f7fe9dc44e36',
  id,
  'Black Friday ' || name,
  'Campanha exclusiva com 20% de desconto no preço final e bônus de comissão.',
  20,
  'active'
FROM public.products
WHERE brand_id = '19563f2c-3987-4fb8-914f-f7fe9dc44e36';
