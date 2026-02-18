-- ========================================
-- 05_VIEW_COUNT_CLEANUP.sql
-- ========================================
-- Purpose: Create mechanisms to clean up old data from post_view_events
-- Run this to prevent the table from growing indefinitely.

-- 1. Create a function to delete old records
-- Keeps data for 24 hours (enough for idempotency) and deletes older
CREATE OR REPLACE FUNCTION cleanup_old_view_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM post_view_events
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- 2. Grant permission to run this function
GRANT EXECUTE ON FUNCTION cleanup_old_view_events() TO anon, authenticated, service_role;

-- 3. Option A: Attempt to schedule with pg_cron (if available)
-- This block will only run if the pg_cron extension is enabled on your instance
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Schedule to run every hour
        PERFORM cron.schedule(
            'cleanup-view-events', 
            '0 * * * *', 
            'SELECT cleanup_old_view_events()'
        );
        RAISE NOTICE 'Scheduled automatic cleanup using pg_cron';
    ELSE
        RAISE NOTICE 'pg_cron extension not found. You can set up a Scheduled Function in Supabase Dashboard.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not schedule cron job automatically: %', SQLERRM;
END $$;

-- 4. Option B: Probabilistic Cleanup on Insert
-- Modify the increment function to occasionally clean up (1 percent chance)
-- This acts as a fallback if cron is not set up.
CREATE OR REPLACE FUNCTION increment_view_count(p_id text, p_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_post_id BIGINT;
BEGIN
    -- 1% chance to clean up old records
    IF (random() < 0.01) THEN
        PERFORM cleanup_old_view_events();
    END IF;

    -- Cast text ID to BIGINT safely
    v_post_id := p_id::bigint;

    -- Try to insert to check for duplicates
    INSERT INTO post_view_events (request_id, post_id)
    VALUES (p_request_id, v_post_id)
    ON CONFLICT (request_id) DO NOTHING;

    -- Only increment if the INSERT actually happened
    IF FOUND THEN
        UPDATE posts
        SET view_count = view_count + 1
        WHERE id = v_post_id;
    END IF;
END;
$$;

-- 5. Verification
DO $$
BEGIN
    RAISE NOTICE '=== CLEANUP SETUP COMPLETED ===';
    RAISE NOTICE 'Function cleanup_old_view_events() created.';
    RAISE NOTICE 'increment_view_count() updated to include probabilistic cleanup (1 percent chance).';
    RAISE NOTICE 'This ensures the table stays small automatically.';
    RAISE NOTICE '===============================';
END $$;
