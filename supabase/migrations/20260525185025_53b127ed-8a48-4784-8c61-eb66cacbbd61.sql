-- Update profiles with realistic demo data
INSERT INTO public.profiles (user_id, username, display_name, avatar_url, bio, followers_count, total_sales, total_revenue, performance_score, niches)
VALUES 
('021805bc-3826-4534-a4eb-b40841b4dfa7', 'joao_affiliate', 'João do Tráfego', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', 'Especialista em lançamentos e tráfego pago para infoprodutos.', 15420, 1240, 45200.50, 98.5, ARRAY['Tecnologia', 'Saúde']),
('9e47fea7-f4e8-4167-bbc6-0a843e396174', 'premium_store', 'Premium Store Global', 'https://api.dicebear.com/7.x/identicon/svg?seed=Premium', 'Sua marca de luxo com os melhores produtos do mercado.', 2500, 5000, 120000.00, 95.0, ARRAY['Moda', 'Beleza'])
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  followers_count = EXCLUDED.followers_count,
  total_sales = EXCLUDED.total_sales,
  total_revenue = EXCLUDED.total_revenue,
  performance_score = EXCLUDED.performance_score;

-- Ensure the brand record is updated
UPDATE public.brands 
SET name = 'Premium Store Global', 
    description = 'Sua marca de luxo com os melhores produtos do mercado.',
    status = 'active',
    verified = true
WHERE id = '19563f2c-3987-4fb8-914f-f7fe9dc44e36';

-- Delete existing mock products to avoid duplicates
DELETE FROM public.products WHERE brand_id = '19563f2c-3987-4fb8-914f-f7fe9dc44e36';

-- Seed Products for the Brand
INSERT INTO public.products (id, brand_id, name, description, price, commission_value, category, image_url, active)
VALUES 
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Smartwatch Pro Ultra', 'O smartwatch mais avançado com monitoramento de saúde 24h.', 299.90, 45.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1544117518-30df57809ca7?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Fone Noise Cancelling Max', 'Qualidade de áudio de estúdio com cancelamento de ruído ativo.', 899.00, 120.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', true),
(gen_random_uuid(), '19563f2c-3987-4fb8-914f-f7fe9dc44e36', 'Kit Skincare Premium', 'Tratamento completo para todos os tipos de pele.', 159.00, 30.00, 'Beleza', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', true);

-- Seed Campaigns
INSERT INTO public.campaigns (brand_id, product_id, name, description, bonus_percentage, status)
SELECT 
  '19563f2c-3987-4fb8-914f-f7fe9dc44e36',
  id,
  'Lançamento ' || name,
  'Campanha de lançamento com comissão turbinada.',
  15,
  'active'
FROM public.products
WHERE brand_id = '19563f2c-3987-4fb8-914f-f7fe9dc44e36'
LIMIT 2;

-- Wallet Transactions for Affiliate
INSERT INTO public.wallet_transactions (user_id, type, amount, status, description)
VALUES 
('021805bc-3826-4534-a4eb-b40841b4dfa7', 'commission', 5000.00, 'completed', 'Comissão acumulada de vendas - Março'),
('021805bc-3826-4534-a4eb-b40841b4dfa7', 'bonus', 1250.50, 'completed', 'Bônus de performance - Smartwatch Pro'),
('021805bc-3826-4534-a4eb-b40841b4dfa7', 'withdrawal', -2500.00, 'completed', 'Saque para conta bancária'),
('021805bc-3826-4534-a4eb-b40841b4dfa7', 'commission', 840.00, 'completed', 'Comissão de venda direta - Fone Max');

-- Orders for metrics (populate charts)
INSERT INTO public.orders (user_id, affiliate_id, status, total, currency)
VALUES 
('9e47fea7-f4e8-4167-bbc6-0a843e396174', '021805bc-3826-4534-a4eb-b40841b4dfa7', 'completed', 299.90, 'BRL'),
('9e47fea7-f4e8-4167-bbc6-0a843e396174', '021805bc-3826-4534-a4eb-b40841b4dfa7', 'completed', 899.00, 'BRL'),
('143c41b9-68c3-4e1e-b545-a7f77dd93888', '021805bc-3826-4534-a4eb-b40841b4dfa7', 'completed', 159.00, 'BRL');
