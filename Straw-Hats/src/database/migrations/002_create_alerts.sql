CREATE TABLE IF NOT EXISTS alerts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease       TEXT NOT NULL,
    region        TEXT,
    case_count    INTEGER NOT NULL,
    severity      TEXT NOT NULL,
    center_lat    DECIMAL(10,8),
    center_lng    DECIMAL(11,8),
    radius_km     INTEGER DEFAULT 50,
    active        BOOLEAN DEFAULT true,
    first_seen_at TIMESTAMPTZ NOT NULL,
    last_seen_at  TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
