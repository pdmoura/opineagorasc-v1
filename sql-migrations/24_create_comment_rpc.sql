-- Função RPC para criar comentários como alternativa direta
-- Esta função bypass RLS usando SECURITY DEFINER
-- Permite que usuários anônimos criem comentários com validações

CREATE OR REPLACE FUNCTION create_comment(
    p_post_id UUID,
    p_name TEXT,
    p_email TEXT,
    p_content TEXT
)
RETURNS TABLE (
    id UUID,
    post_id UUID,
    name TEXT,
    email TEXT,
    content TEXT,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validações básicas
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RAISE EXCEPTION 'Nome é obrigatório';
    END IF;
    
    IF length(trim(p_name)) < 2 THEN
        RAISE EXCEPTION 'Nome deve ter pelo menos 2 caracteres';
    END IF;
    
    IF p_email IS NULL OR trim(p_email) = '' THEN
        RAISE EXCEPTION 'Email é obrigatório';
    END IF;
    
    IF position('@' in p_email) = 0 THEN
        RAISE EXCEPTION 'Email inválido';
    END IF;
    
    IF p_content IS NULL OR trim(p_content) = '' THEN
        RAISE EXCEPTION 'Comentário é obrigatório';
    END IF;
    
    IF length(trim(p_content)) < 10 THEN
        RAISE EXCEPTION 'Comentário deve ter pelo menos 10 caracteres';
    END IF;
    
    IF p_post_id IS NULL THEN
        RAISE EXCEPTION 'Post ID é obrigatório';
    END IF;
    
    -- Inserir o comentário com status pending
    RETURN QUERY
    INSERT INTO comments (
        post_id,
        name,
        email,
        content,
        status,
        created_at
    )
    VALUES (
        p_post_id,
        trim(p_name),
        lower(trim(p_email)),
        trim(p_content),
        'pending',
        NOW()
    )
    RETURNING 
        id,
        post_id,
        name,
        email,
        content,
        status,
        created_at;
END;
$$;

-- Conceder permissão para executar a função
GRANT EXECUTE ON FUNCTION create_comment TO anon;
GRANT EXECUTE ON FUNCTION create_comment TO authenticated;
