CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone         TEXT,
    email         TEXT,
    region        TEXT,
    language_pref TEXT DEFAULT 'en',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
