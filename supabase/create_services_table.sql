-- Create services table (mirrors projects structure)
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  short_description text,
  long_description text,
  image_url text NOT NULL,
  icon text DEFAULT '🔧',
  tags text[] DEFAULT '{}',
  link_url text,
  size text DEFAULT 'medium',
  image_position text DEFAULT 'object-center',
  image_fit text DEFAULT 'cover',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view services)
CREATE POLICY "Public read access" ON services
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated insert access" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated update access" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated delete access" ON services
  FOR DELETE USING (auth.role() = 'authenticated');
