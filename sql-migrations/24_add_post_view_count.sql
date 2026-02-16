-- Migration: Add view_count column to posts table
-- Date: 2026-02-16
-- Purpose: Track post views for analytics and display

-- Add view_count column to posts table
ALTER TABLE posts 
ADD COLUMN view_count INTEGER DEFAULT 0 NOT NULL;

-- Add index for better performance on view counting
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);

-- Add index for sorting by views
CREATE INDEX IF NOT EXISTS idx_posts_views_date ON posts(view_count DESC, date DESC);

-- Create a function to increment view count
CREATE OR REPLACE FUNCTION increment_post_view(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE posts 
    SET view_count = view_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get posts sorted by views
CREATE OR REPLACE FUNCTION get_popular_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    image TEXT,
    author TEXT,
    date TIMESTAMP WITH TIME ZONE,
    status TEXT,
    category TEXT,
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

-- RLS Policy for view count updates
-- Allow authenticated users to increment view counts
CREATE POLICY "Users can increment post views" ON posts
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        (SELECT COUNT(*) FROM posts WHERE id = posts.id) > 0
    )
    WITH CHECK (true);

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_post_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_posts(INTEGER) TO authenticated;

-- Update existing posts to have initial view count
UPDATE posts SET view_count = 0 WHERE view_count IS NULL;

-- Add comment to document the migration
COMMENT ON COLUMN posts.view_count IS 'Number of times the post has been viewed';
COMMENT ON FUNCTION increment_post_view(UUID) IS 'Increments the view count for a specific post';
COMMENT ON FUNCTION get_popular_posts(INTEGER) IS 'Returns posts sorted by view count in descending order';
