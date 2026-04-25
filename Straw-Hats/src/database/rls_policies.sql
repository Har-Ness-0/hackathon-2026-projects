-- Enable RLS on all tables
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE users     ENABLE ROW LEVEL SECURITY;

-- Anyone can read diagnoses (public map)
CREATE POLICY "Public read diagnoses"
    ON diagnoses FOR SELECT
    USING (true);

-- Only service role can insert diagnoses (backend writes)
CREATE POLICY "Service role insert diagnoses"
    ON diagnoses FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Users can update only their own feedback fields
CREATE POLICY "Users update own feedback"
    ON diagnoses FOR UPDATE
    USING (user_session_id = auth.uid())
    WITH CHECK (true);

-- Anyone can read alerts
CREATE POLICY "Public read alerts"
    ON alerts FOR SELECT
    USING (true);

-- Only service role can manage alerts
CREATE POLICY "Service role manage alerts"
    ON alerts FOR ALL
    WITH CHECK (auth.role() = 'service_role');
