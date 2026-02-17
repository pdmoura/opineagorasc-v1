-- Function to increment post view count atomically
CREATE OR REPLACE FUNCTION increment_post_view_text(post_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE posts 
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = post_id::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular posts
CREATE OR REPLACE FUNCTION get_popular_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    category TEXT,
    author TEXT,
    date TIMESTAMP WITH TIME ZONE,
    image TEXT,
    featured BOOLEAN,
    view_count INTEGER,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.category,
        p.author,
        p.date,
        p.image,
        p.featured,
        COALESCE(p.view_count, 0) as view_count,
        p.status
    FROM posts p
    WHERE p.status = 'published'
    ORDER BY COALESCE(p.view_count, 0) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
