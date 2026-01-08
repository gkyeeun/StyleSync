-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member TEXT NOT NULL,
  member_id TEXT,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table (linked to outfits)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  purchase_link TEXT,
  image TEXT,
  purchase_options JSONB DEFAULT '[]'::jsonb,
  availability TEXT,
  last_updated TEXT,
  style JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  description TEXT,
  currency TEXT DEFAULT '₩',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  user_id TEXT, -- Optional: for future user authentication
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(outfit_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_outfits_member ON outfits(member);
CREATE INDEX IF NOT EXISTS idx_outfits_event ON outfits(event);
CREATE INDEX IF NOT EXISTS idx_outfits_date ON outfits(date);
CREATE INDEX IF NOT EXISTS idx_items_outfit_id ON items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_favorites_outfit_id ON favorites(outfit_id);

-- Enable Row Level Security (RLS) - for now, allow all operations
-- You can restrict this later based on your authentication needs
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access for now)
CREATE POLICY "Allow all operations on outfits" ON outfits
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on items" ON items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on favorites" ON favorites
  FOR ALL USING (true) WITH CHECK (true);
