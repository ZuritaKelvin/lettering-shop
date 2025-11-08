-- Performance Optimization: Add indexes for better query performance
-- Migration created: 2024-11-08

-- Index for searching products by name (full text search in Spanish)
CREATE INDEX IF NOT EXISTS idx_products_name_search 
ON products USING gin(to_tsvector('spanish', name));

-- Index for filtering products by price
CREATE INDEX IF NOT EXISTS idx_products_price 
ON products(price);

-- Index for sorting products by delivery date
CREATE INDEX IF NOT EXISTS idx_products_delivery_date 
ON products(delivery_date);

-- Index for product_colors with stock available (partial index for performance)
CREATE INDEX IF NOT EXISTS idx_product_colors_stock_available 
ON product_colors(product_id, stock) 
WHERE stock > 0;

-- Index for product_colors by color
CREATE INDEX IF NOT EXISTS idx_product_colors_color 
ON product_colors(color);

-- Composite index for cart_items queries (user_id + product_color_id)
-- Already exists in schema but ensuring it's optimal
CREATE INDEX IF NOT EXISTS idx_cart_items_composite 
ON cart_items(user_id, product_color_id, quantity);

-- Index for orders by account and status
CREATE INDEX IF NOT EXISTS idx_orders_account_status 
ON orders(account_id, status);

-- Index for orders by created date (if you add created_at column)
-- CREATE INDEX IF NOT EXISTS idx_orders_created_at 
-- ON orders(created_at DESC);

-- Comment: These indexes will significantly improve:
-- 1. Product search and filtering performance
-- 2. Cart item lookups
-- 3. Order history queries
-- 4. Stock availability checks
