-- Create purchases table
CREATE TABLE purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    affiliate_code TEXT,
    app_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Enable insert for authenticated users only" ON purchases
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON purchases
    FOR SELECT TO authenticated
    USING (true); 