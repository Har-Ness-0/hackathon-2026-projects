CREATE TABLE IF NOT EXISTS diagnoses (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_type          TEXT NOT NULL CHECK (animal_type IN ('cattle','goat','poultry','pig')),
    symptoms_text        TEXT NOT NULL,
    language             TEXT DEFAULT 'en',
    image_url            TEXT,
    disease              TEXT NOT NULL,
    confidence           INTEGER CHECK (confidence BETWEEN 0 AND 100),
    severity             TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    description          TEXT,
    immediate_action     TEXT,
    treatment            TEXT,
    prevention           TEXT,
    vet_required         BOOLEAN DEFAULT false,
    zoonotic_risk        BOOLEAN DEFAULT false,
    lat                  DECIMAL(10,8),
    lng                  DECIMAL(11,8),
    user_session_id      UUID,
    feedback_correct     BOOLEAN,
    feedback_correction  TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_location
    ON diagnoses (lat, lng) WHERE lat IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_diagnoses_disease
    ON diagnoses (disease);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created
    ON diagnoses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_severity
    ON diagnoses (severity);
