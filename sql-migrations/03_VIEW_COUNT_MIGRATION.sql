-- ========================================
-- 03_VIEW_COUNT_MIGRATION.sql
-- ========================================
-- Safe migration to add View Count logic WITHOUT rebuilding tables.
-- Run this to fix the "404" errors and enable idempotency.

-- 1. Create Idempotency Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS post_view_events (
    request_id UUID PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Index for performance
CREATE INDEX IF NOT EXISTS idx_post_view_events_created_at ON post_view_events(created_at);

-- 3. Enable RLS on the new table
ALTER TABLE post_view_events ENABLE ROW LEVEL SECURITY;

-- 4. Create/Replace the Idempotent View Count Function
-- Explicitly DROP first to avoid "cannot change return type" error
DROP FUNCTION IF EXISTS increment_view_count(text, uuid);

CREATE OR REPLACE FUNCTION increment_view_count(p_id text, p_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_post_id BIGINT;
BEGIN
    -- Cast text ID to BIGINT safely
    v_post_id := p_id::bigint;

    -- Try to insert the unique request ID
    -- If it already exists (collision), ON CONFLICT will trigger and we do nothing
    INSERT INTO post_view_events (request_id, post_id)
    VALUES (p_request_id, v_post_id)
    ON CONFLICT (request_id) DO NOTHING;

    -- Only increment if the INSERT actually happened (row was added)
    IF FOUND THEN
        UPDATE posts
        SET view_count = view_count + 1
        WHERE id = v_post_id;
    END IF;
END;
$$;

-- 5. Create/Replace Popular Posts Function
-- Explicitly DROP first to avoid "cannot change return type" error
DROP FUNCTION IF EXISTS get_popular_posts(integer);

CREATE OR REPLACE FUNCTION get_popular_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    slug VARCHAR,
    excerpt TEXT,
    image VARCHAR,
    author VARCHAR,
    date TIMESTAMP WITH TIME ZONE,
    status VARCHAR,
    category VARCHAR,
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.image,
        p.author,
        p.date,
        p.status,
        p.category,
        p.view_count
    FROM posts p
    WHERE p.status = 'published'
    ORDER BY p.view_count DESC, p.date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Grant Permissions (Fixes the 404/403 errors)
-- Grant access to the functions
GRANT EXECUTE ON FUNCTION increment_view_count(text, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_popular_posts(integer) TO anon, authenticated, service_role;

-- Grant access to the new table
GRANT INSERT ON post_view_events TO anon;
GRANT SELECT ON post_view_events TO authenticated;
GRANT ALL ON post_view_events TO service_role;

-- 7. Verification output
DO $$
BEGIN
    RAISE NOTICE '=== VIEW COUNT MIGRATION COMPLETED ===';
    RAISE NOTICE 'Functions created/updated: increment_view_count, get_popular_posts';
    RAISE NOTICE 'Table created (if missing): post_view_events';
    RAISE NOTICE 'Permissions granted to public/anon role';
    RAISE NOTICE 'Your current Data (Posts, etc.) was NOT touched.';
    RAISE NOTICE '========================================';
END $$;
