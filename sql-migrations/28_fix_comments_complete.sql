-- SCRIPT COMPLETO PARA CORRIGIR COMENTÁRIOS COM SEGURANÇA
-- Execute este SQL inteiro no Supabase Dashboard

-- 1. PRIMEIRO: Desabilitar RLS temporariamente para poder configurar
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 2. Verificar/Criar tabela com estrutura correta
DO $$
BEGIN
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
    
    RAISE NOTICE 'Tabela comments verificada/criada';
END $$;

-- 3. Criar constraint para rate limiting por e-mail
DO $$
BEGIN
    -- Verificar se constraint existe antes de remover
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_email_time_unique' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE comments DROP CONSTRAINT comments_email_time_unique;
        RAISE NOTICE 'Constraint antigo removido';
    END IF;
    
    -- Criar constraint único para rate limiting
    ALTER TABLE comments 
    ADD CONSTRAINT comments_email_time_unique 
    UNIQUE (email, post_id, created_at);
    
    RAISE NOTICE 'Constraint de rate limiting criado';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint já existe';
END $$;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_email ON comments(email);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 5. Criar trigger para updated_at
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

-- 6. REABILITAR RLS com políticas corretas
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 7. Remover políticas antigas se existirem
DO $$
BEGIN
    -- Remover políticas uma por uma para evitar erros
    DROP POLICY IF EXISTS "Allow anonymous insert comments" ON comments;
    DROP POLICY IF EXISTS "Allow read approved comments" ON comments;
    DROP POLICY IF EXISTS "Allow anonymous read approved comments" ON comments;
    DROP POLICY IF EXISTS "Allow authenticated read all comments" ON comments;
    DROP POLICY IF EXISTS "Authenticated users can manage comments" ON comments;
    
    RAISE NOTICE 'Politicas antigas removidas';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Algumas políticas não existiam ou erro ao remover';
END $$;

-- 8. Criar políticas RLS corretas

-- Política para usuários anônimos inserirem comentários
CREATE POLICY "Allow anonymous insert comments" ON comments
FOR INSERT TO anon
WITH CHECK (
    status = 'pending' AND 
    length(trim(name)) >= 2 AND 
    length(trim(email)) >= 5 AND 
    length(trim(content)) >= 10
);

-- Política para usuários anônimos lerem comentários aprovados
CREATE POLICY "Allow anonymous read approved comments" ON comments
FOR SELECT TO anon
USING (status = 'approved');

-- Política para usuários autenticados terem controle total
CREATE POLICY "Authenticated users can manage comments" ON comments
FOR ALL TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 9. Conceder permissões corretas
GRANT SELECT ON comments TO anon;
GRANT INSERT ON comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;
GRANT ALL ON comments TO service_role;

-- 10. Verificar configuração final
DO $$
DECLARE
    rls_enabled boolean;
    policy_count integer;
BEGIN
    SELECT rowsecurity INTO rls_enabled 
    FROM pg_tables 
    WHERE tablename = 'comments';
    
    SELECT count(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'comments';
    
    RAISE NOTICE 'RLS habilitado: %', rls_enabled;
    RAISE NOTICE 'Numero de politicas: %', policy_count;
    
    IF rls_enabled AND policy_count >= 3 THEN
        RAISE NOTICE 'Configuracao de comentarios concluida com sucesso!';
    ELSE
        RAISE NOTICE 'Verifique a configuracao manualmente';
    END IF;
END $$;
