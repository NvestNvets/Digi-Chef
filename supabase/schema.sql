-- Create orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status TEXT DEFAULT 'pending'::text NOT NULL
);

-- Create verifications table
CREATE TABLE verifications (
    id BIGSERIAL PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    verified BOOLEAN DEFAULT false NOT NULL
);

-- Create RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Enable insert for authenticated users only" ON orders
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON orders
    FOR SELECT TO authenticated
    USING (true);

-- Create policies for verifications
CREATE POLICY "Enable insert for authenticated users only" ON verifications
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON verifications
    FOR SELECT TO authenticated
    USING (true); 