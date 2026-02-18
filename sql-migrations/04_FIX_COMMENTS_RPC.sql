-- ========================================
-- 04_FIX_COMMENTS_RPC.sql
-- ========================================
-- Restore the missing RPC function for safe comment insertion
-- Run this in Supabase SQL Editor to fix RLS issues completely

-- 1. Create function for safe comment insertion
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

-- 2. Grant access to function (RPC)
GRANT EXECUTE ON FUNCTION insert_comment_safely TO anon, authenticated;

-- 3. Notify
NOTIFY pgrst, 'reload schema';
