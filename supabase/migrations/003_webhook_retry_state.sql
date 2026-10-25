-- A webhook must not be marked processed until its payment transition succeeds.
-- This permits Razorpay retries after transient application/database failures.
ALTER TABLE IF EXISTS payment_webhook_events
    ALTER COLUMN processed_at DROP NOT NULL,
    ALTER COLUMN processed_at DROP DEFAULT;

ALTER TABLE IF EXISTS payment_webhook_events
    ADD COLUMN IF NOT EXISTS error_message TEXT;
