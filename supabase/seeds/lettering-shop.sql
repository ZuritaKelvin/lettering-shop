-- Lettering Shop


/**
 * -------------------------------------------------------
 * Seed: Products
 * -------------------------------------------------------
 */

-- Insert Black Coat product
INSERT INTO public.products (id, name, description, price, delivery_date)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid,
    'Winter Coat',
    'Elegant black winter coat with premium insulation. Perfect for cold weather, featuring a modern fit and durable water-resistant fabric. Stay warm and stylish all season long.',
    60.00,
    CURRENT_DATE + INTERVAL '7 days'
);

-- Insert available colors for the Black Coat
INSERT INTO public.product_colors (product_id, color, image_url, stock)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid, 'black','https://www.pngkey.com/png/full/205-2055869_winter-coat-png-black-winter-jacket-men.png',12);