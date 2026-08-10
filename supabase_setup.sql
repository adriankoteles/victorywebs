-- Victory Webs Agency OS - Supabase Setup Script

-- 1. Tabulka: Klienti (Clients)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id TEXT UNIQUE NOT NULL, -- např. VW-001
    pin_code TEXT NOT NULL, -- 6místný PIN pro přihlášení klienta
    
    -- Business Info
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    ico TEXT,
    dic TEXT,
    address TEXT,
    billing_email TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'Onboarding' CHECK (status IN ('Onboarding', 'In Development', 'Active Monthly', 'Paused')),
    
    -- Web Hub
    main_domain TEXT,
    staging_domain TEXT,
    github_repo TEXT,
    registrar TEXT,
    hosting TEXT,
    social_media JSONB, -- Odkazy na sítě
    
    -- Retainer (Paušál)
    retainer_active BOOLEAN DEFAULT FALSE,
    retainer_billing_day INTEGER,
    retainer_remaining_hours NUMERIC(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabulka: Projekty (Projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    deadline DATE,
    description TEXT,
    
    -- Kanban fáze
    stage TEXT NOT NULL DEFAULT 'Nabídka' CHECK (stage IN ('Nabídka', 'V práci', 'Hotovo', 'Zaplaceno')),
    
    -- Soft Delete
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
-- Bezpečnostní model: 
-- Majitel (autentizovaný admin v Supabase) má přístup ke všemu.
-- Klienti se nebudou autentizovat přes klasické Supabase auth (protože používají ID + PIN), 
-- takže API klientské zóny bude řešeno přes Server Actions (které obchází RLS použitím service_role nebo custom logiky) 
-- nebo si vytvoříme custom auth s JWT. Prozatím chráníme tabulky tak, aby přístup měly jen authenticated users (admini).

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Admin má plný přístup k tabulce clients
CREATE POLICY "Admin full access to clients"
ON clients
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin má plný přístup k tabulce projects
CREATE POLICY "Admin full access to projects"
ON projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Pro klientskou zónu: přístup bude spravován v Next.js přes Server Actions 
-- ověřující kombinaci system_id a pin_code přímo v DB, nikoli přes anonymní API calls z klienta.

-- Funkce pro automatický update `updated_at`
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
