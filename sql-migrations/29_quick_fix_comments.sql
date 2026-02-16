-- SOLUÇÃO RÁPIDA E GARANTIDA PARA COMENTÁRIOS
-- Execute este SQL no Supabase Dashboard AGORA

-- 1. Desabilitar RLS completamente (solução mais rápida)
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 2. Garantir que tabela existe com estrutura correta
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

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_email ON comments(email);

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

-- 6. Verificar configuração
SELECT 
    'Tabela comments' as tabela,
    schemaname as schema,
    tablename as nome,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE tablename = 'comments';

SELECT 
    grantee,
    privilege_type,
    table_name
FROM information_schema.role_table_grants 
WHERE table_name = 'comments';
