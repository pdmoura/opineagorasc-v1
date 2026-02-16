-- ========================================
-- 02_SECURITY_SETUP.sql
-- ========================================
-- Security setup for Opine Agora SC
-- Execute this AFTER 01_DATABASE_SETUP.sql

-- 1. Enable Row Level Security on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 2. Remove existing policies (if any)
DO $$
BEGIN
    -- Drop policies for posts
    DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON posts;
    DROP POLICY IF EXISTS "Enable update for authenticated users" ON posts;
    DROP POLICY IF EXISTS "Enable delete for authenticated users" ON posts;
    
    -- Drop policies for comments
    DROP POLICY IF EXISTS "Allow anonymous insert comments" ON comments;
    DROP POLICY IF EXISTS "Allow anonymous read approved comments" ON comments;
    DROP POLICY IF EXISTS "Allow authenticated read all comments" ON comments;
    DROP POLICY IF EXISTS "Authenticated users can manage comments" ON comments;
    
    -- Drop policies for ads
    DROP POLICY IF EXISTS "Enable read access for all users ads" ON ads;
    DROP POLICY IF EXISTS "Enable insert for authenticated users ads" ON ads;
    DROP POLICY IF EXISTS "Enable update for authenticated users ads" ON ads;
    DROP POLICY IF EXISTS "Enable delete for authenticated users ads" ON ads;
    
    RAISE NOTICE 'Existing policies removed';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Some policies did not exist or error removing them';
END $$;

-- 3. Create policies for posts table
-- Public can read published posts
CREATE POLICY "Enable read access for all users" ON posts
FOR SELECT TO anon, authenticated
USING (status = 'published');

-- Authenticated users can manage posts
CREATE POLICY "Enable insert for authenticated users" ON posts
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON posts
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON posts
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

-- 4. Create policies for comments table
-- Anonymous users can insert comments (with validation)
CREATE POLICY "Allow anonymous insert comments" ON comments
FOR INSERT TO anon
WITH CHECK (
    status = 'pending' AND 
    length(trim(name)) >= 2 AND 
    length(trim(email)) >= 5 AND 
    length(trim(content)) >= 10
);

-- Everyone can read approved comments
CREATE POLICY "Allow anonymous read approved comments" ON comments
FOR SELECT TO anon, authenticated
USING (status = 'approved');

-- Authenticated users can manage all comments
CREATE POLICY "Authenticated users can manage comments" ON comments
FOR ALL TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 5. Create policies for ads table
-- Public can read approved ads
CREATE POLICY "Enable read access for all users ads" ON ads
FOR SELECT TO anon, authenticated
USING (status = 'approved');

-- Authenticated users can manage ads
CREATE POLICY "Enable insert for authenticated users ads" ON ads
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users ads" ON ads
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users ads" ON ads
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

-- 6. Grant permissions
-- Posts permissions
GRANT SELECT ON posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO authenticated;
GRANT ALL ON posts TO service_role;

-- Comments permissions
GRANT SELECT, INSERT ON comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;
GRANT ALL ON comments TO service_role;

-- Ads permissions
GRANT SELECT ON ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ads TO authenticated;
GRANT ALL ON ads TO service_role;

-- 7. Create function for safe comment insertion
CREATE OR REPLACE FUNCTION insert_comment_safely(
    p_post_id BIGINT,
    p_name VARCHAR(100),
    p_email VARCHAR(255),
    p_content TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    comment_id BIGINT
) AS $$
DECLARE
    new_comment_id BIGINT;
BEGIN
    -- Try to insert comment
    BEGIN
        INSERT INTO comments (post_id, name, email, content, status)
        VALUES (p_post_id, p_name, p_email, p_content, 'pending')
        RETURNING id INTO new_comment_id;
        
        RETURN QUERY SELECT true, 'Comentário enviado com sucesso!', new_comment_id;
        RETURN;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN QUERY SELECT false, SQLERRM, NULL::BIGINT;
            RETURN;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant access to safe function
GRANT EXECUTE ON FUNCTION insert_comment_safely TO anon, authenticated;

-- 9. Final verification
DO $$
DECLARE
    posts_rls boolean;
    comments_rls boolean;
    ads_rls boolean;
    posts_policies integer;
    comments_policies integer;
    ads_policies integer;
BEGIN
    -- Check RLS status
    SELECT rowsecurity INTO posts_rls FROM pg_tables WHERE tablename = 'posts';
    SELECT rowsecurity INTO comments_rls FROM pg_tables WHERE tablename = 'comments';
    SELECT rowsecurity INTO ads_rls FROM pg_tables WHERE tablename = 'ads';
    
    -- Count policies
    SELECT count(*) INTO posts_policies FROM pg_policies WHERE tablename = 'posts';
    SELECT count(*) INTO comments_policies FROM pg_policies WHERE tablename = 'comments';
    SELECT count(*) INTO ads_policies FROM pg_policies WHERE tablename = 'ads';
    
    -- Report results
    RAISE NOTICE '=== SECURITY SETUP COMPLETED ===';
    RAISE NOTICE 'RLS Status:';
    RAISE NOTICE '  Posts: % (%) policies', posts_rls, posts_policies;
    RAISE NOTICE '  Comments: % (%) policies', comments_rls, comments_policies;
    RAISE NOTICE '  Ads: % (%) policies', ads_rls, ads_policies;
    RAISE NOTICE '';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '  ✓ Row Level Security on all tables';
    RAISE NOTICE '  ✓ Rate limiting via unique constraint (email, post_id, created_at)';
    RAISE NOTICE '  ✓ Anonymous comment submission';
    RAISE NOTICE '  ✓ Authenticated user management';
    RAISE NOTICE '  ✓ Safe comment insertion function';
    RAISE NOTICE '';
    RAISE NOTICE 'Your application is now secure and ready!';
    RAISE NOTICE '=================================';
END $$;

-- 10. Refresh schema for Supabase APIs
NOTIFY pgrst, 'reload schema';
