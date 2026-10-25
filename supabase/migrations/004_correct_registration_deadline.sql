-- Correct the Skaleathon registration window ahead of the January 2027 stages.
UPDATE events
SET
    registration_start_at = '2026-10-01T00:00:00.000Z',
    registration_end_at = '2026-12-31T18:29:59.000Z',
    updated_at = NOW()
WHERE id = 'skaleathon-2027';
