-- Solução temporária para habilitar comentários
-- Desabilita RLS temporariamente ou cria políticas simples

-- Opção 1: Desabilitar RLS completamente (temporário)
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Opção 2: Se preferir manter RLS, use estas políticas simples:
-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Allow anonymous insert comments" ON comments;
DROP POLICY IF EXISTS "Allow read approved comments" ON comments;
DROP POLICY IF EXISTS "Allow admin read all comments" ON comments;
DROP POLICY IF EXISTS "Allow admin update all comments" ON comments;
DROP POLICY IF EXISTS "Allow admin delete all comments" ON comments;
DROP POLICY IF EXISTS "Allow users update own comments" ON comments;
DROP POLICY IF EXISTS "Allow users delete own pending comments" ON comments;

-- Criar políticas simples que funcionam
CREATE POLICY "Enable all operations on comments" ON comments
FOR ALL
USING (true)
WITH CHECK (true);

-- Garantir que a tabela exista com as colunas corretas
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_email ON comments(email);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Criar trigger para updated_at
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

-- Conceder permissões básicas
GRANT ALL ON comments TO anon;
GRANT ALL ON comments TO authenticated;
GRANT ALL ON comments TO service_role;

-- Resetar sequências se necessário
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'comments_id_seq') THEN
        PERFORM setval('comments_id_seq', 1, false);
    END IF;
END $$;
