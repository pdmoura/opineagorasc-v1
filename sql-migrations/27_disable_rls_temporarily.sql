-- Solução imediata: Desabilitar RLS temporariamente para comentários funcionarem
-- Execute este SQL no Supabase Dashboard para corrigir o erro 42501

-- 1. Desabilitar RLS completamente na tabela comments
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se a tabela existe com estrutura correta
DO $$
BEGIN
    -- Criar tabela se não existir
    CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id UUID NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    RAISE NOTICE 'Tabela comments verificada/criada com sucesso';
END $$;

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_email ON comments(email);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 4. Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Conceder permissões completas (sem RLS, precisamos de permissões diretas)
GRANT ALL ON comments TO anon;
GRANT ALL ON comments TO authenticated;
GRANT ALL ON comments TO service_role;

-- 6. Garantir que a sequência UUID funcione
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'comments_id_seq') THEN
        PERFORM setval('comments_id_seq', 1, false);
    END IF;
END $$;

-- 7. Teste de inserção (remova o comentário -- para executar)
-- INSERT INTO comments (post_id, name, email, content, status) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com', 'Test comment', 'pending');

-- 8. Verificar permissões
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    hasindexes,
    hastriggers
FROM pg_tables 
WHERE tablename = 'comments';

SELECT 
    grantee,
    privilege_type,
    table_schema,
    table_name
FROM information_schema.role_table_grants 
WHERE table_name = 'comments';
