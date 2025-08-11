-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_day DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity_available INTEGER DEFAULT 1,
  image_url TEXT,
  features TEXT[], -- Array of features
  specifications JSONB, -- JSON object for specs
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Rental Orders Table
CREATE TABLE IF NOT EXISTS rental_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_rental_orders_user_id ON rental_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_rental_orders_product_id ON rental_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_rental_orders_dates ON rental_orders(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rental_orders_status ON rental_orders(status);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rental_orders_updated_at ON rental_orders;
CREATE TRIGGER update_rental_orders_updated_at
    BEFORE UPDATE ON rental_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, price_per_day, category, quantity_available, image_url, features, specifications) VALUES
('Professional DSLR Camera', 'High-quality digital SLR camera perfect for professional photography', 45.00, 'Camera', 3, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', 
 ARRAY['24MP Sensor', '4K Video', 'Weather Sealed', 'Dual Memory Cards'], 
 '{"sensor": "24MP APS-C", "video": "4K 30fps", "iso": "100-25600", "battery": "500 shots"}'),

('MacBook Pro 16"', 'Latest MacBook Pro with M3 chip, perfect for video editing and development', 75.00, 'Laptop', 2, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop', 
 ARRAY['M3 Chip', '32GB RAM', '1TB SSD', 'Liquid Retina Display'], 
 '{"processor": "Apple M3", "ram": "32GB", "storage": "1TB SSD", "display": "16.2-inch Liquid Retina"}'),

('DJI Drone Pro', 'Professional quadcopter drone with 4K camera and gimbal stabilization', 85.00, 'Drone', 2, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', 
 ARRAY['4K Camera', '3-Axis Gimbal', '30min Flight Time', 'Obstacle Avoidance'], 
 '{"camera": "4K 60fps", "flight_time": "30 minutes", "range": "10km", "max_speed": "68 km/h"}'),

('Portable Power Station', 'High-capacity portable battery for camping and emergency power', 35.00, 'Electronics', 4, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop', 
 ARRAY['1000Wh Capacity', 'Multiple Outlets', 'Solar Compatible', 'LCD Display'], 
 '{"capacity": "1000Wh", "outlets": "AC, USB, DC", "charging": "Solar/Wall", "weight": "10kg"}'),

('Professional Microphone', 'Studio-quality condenser microphone for recording and streaming', 25.00, 'Audio', 5, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop', 
 ARRAY['Condenser Type', 'XLR Output', 'Shock Mount', 'Pop Filter Included'], 
 '{"type": "Condenser", "frequency": "20Hz-20kHz", "pattern": "Cardioid", "phantom": "48V required"}'),

('Electric Drill Set', 'Cordless drill with multiple bits and carrying case', 20.00, 'Tools', 6, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop', 
 ARRAY['18V Battery', '50+ Bits', 'LED Light', 'Carrying Case'], 
 '{"voltage": "18V", "torque": "60Nm", "speed": "2000 RPM", "battery": "2.0Ah Li-ion"}'),

('Gaming Console', 'Latest generation gaming console with wireless controller', 40.00, 'Gaming', 3, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop', 
 ARRAY['4K Gaming', 'Ray Tracing', 'Wireless Controller', '1TB Storage'], 
 '{"resolution": "4K HDR", "fps": "120fps", "storage": "1TB NVMe", "backwards": "Compatible"}'),

('Camping Tent 4-Person', 'Waterproof family tent with easy setup for outdoor adventures', 30.00, 'Outdoor', 4, 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop', 
 ARRAY['4-Person Capacity', 'Waterproof', 'Easy Setup', 'Vestibule'], 
 '{"capacity": "4 people", "dimensions": "3m x 2.5m", "height": "1.8m", "weight": "5.2kg"}'),

('Projector 4K', 'High-brightness 4K projector perfect for presentations and home theater', 55.00, 'Electronics', 2, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 
 ARRAY['4K Resolution', '3500 Lumens', 'WiFi Connectivity', 'Multiple Inputs'], 
 '{"resolution": "4K UHD", "brightness": "3500 lumens", "contrast": "50000:1", "lamp": "20000 hours"}'),

('E-Bike Mountain', 'Electric mountain bike with long-range battery and rugged design', 65.00, 'Sports', 2, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop', 
 ARRAY['Electric Motor', '80km Range', '21-Speed', 'Mountain Tires'], 
 '{"motor": "750W", "battery": "48V 15Ah", "range": "80km", "speed": "45 km/h"}'
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can create products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for rental_orders (users can only see their own)
CREATE POLICY "Users can view their own rental orders" ON rental_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rental orders" ON rental_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rental orders" ON rental_orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rental orders" ON rental_orders
  FOR DELETE USING (auth.uid() = user_id);

-- Create a view for available products
CREATE OR REPLACE VIEW available_products AS
SELECT 
  p.*,
  COALESCE(COUNT(ro.id), 0) as current_rentals
FROM products p
LEFT JOIN rental_orders ro ON p.id = ro.product_id 
  AND ro.status IN ('confirmed', 'active')
  AND ro.start_date <= CURRENT_DATE 
  AND ro.end_date >= CURRENT_DATE
WHERE p.is_available = true
GROUP BY p.id;

-- Grant permissions
GRANT SELECT ON available_products TO authenticated, anon;
