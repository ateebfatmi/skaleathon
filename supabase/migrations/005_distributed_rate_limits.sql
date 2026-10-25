-- Atomic, shared rate-limit state for serverless instances. The function is
-- service-role only, so public and authenticated clients cannot manipulate it.
CREATE TABLE IF NOT EXISTS api_rate_limits (
    key TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL CHECK (request_count > 0),
    reset_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION check_rate_limit(
    p_key TEXT,
    p_limit INTEGER,
    p_window_seconds INTEGER
)
RETURNS TABLE (allowed BOOLEAN, retry_after_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count INTEGER;
    current_reset_at TIMESTAMPTZ;
    v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
    IF p_limit < 1 OR p_window_seconds < 1 THEN
        RAISE EXCEPTION 'Rate limit and window must be positive';
    END IF;

    INSERT INTO api_rate_limits AS limits (key, request_count, reset_at, updated_at)
    VALUES (
        p_key,
        1,
        v_now + make_interval(secs => p_window_seconds),
        v_now
    )
    ON CONFLICT (key) DO UPDATE
    SET
        request_count = CASE
            WHEN limits.reset_at <= v_now THEN 1
            ELSE limits.request_count + 1
        END,
        reset_at = CASE
            WHEN limits.reset_at <= v_now
                THEN v_now + make_interval(secs => p_window_seconds)
            ELSE limits.reset_at
        END,
        updated_at = v_now
    RETURNING request_count, reset_at INTO current_count, current_reset_at;

    RETURN QUERY SELECT
        current_count <= p_limit,
        CASE
            WHEN current_count <= p_limit THEN 0
            ELSE GREATEST(1, CEIL(EXTRACT(EPOCH FROM (current_reset_at - v_now)))::INTEGER)
        END;
END;
$$;

REVOKE ALL ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
