-- POLÍTICAS RLS SEGURAS PARA COMENTÁRIOS
-- Execute este SQL no Supabase Dashboard

-- 1. Remover política insegura
DROP POLICY IF EXISTS "Allow all" ON comments;

-- 2. Criar políticas restritivas e seguras

-- Política para usuários anônimos inserirem comentários (com validações)
CREATE POLICY "Allow anonymous insert comments" ON comments
FOR INSERT TO anon
WITH CHECK (
    status = 'pending' AND 
    length(trim(name)) >= 2 AND 
    length(trim(email)) >= 5 AND 
    length(trim(content)) >= 10 AND
    position('@' in email) = 1
);

-- Política para usuários anônimos lerem apenas comentários aprovados
CREATE POLICY "Allow anonymous read approved comments" ON comments
FOR SELECT TO anon
USING (status = 'approved');

-- Política para usuários autenticados (admin) terem controle total
CREATE POLICY "Authenticated users can manage comments" ON comments
FOR ALL TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Criar constraint para rate limiting por e-mail (impede spam rápido)
DO $$
BEGIN
    -- Remover constraint se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_email_time_unique' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE comments DROP CONSTRAINT comments_email_time_unique;
    END IF;
    
    -- Criar constraint único: 1 comentário por e-mail por post por minuto
    ALTER TABLE comments 
    ADD CONSTRAINT comments_email_time_unique 
    UNIQUE (email, post_id, DATE_TRUNC('minute', created_at));
    
    RAISE NOTICE 'Constraint de rate limiting criado';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint já existe';
END $$;

-- 4. Criar função para rate limiting mais avançado (opcional)
CREATE OR REPLACE FUNCTION check_comment_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o mesmo e-mail já comentou nos últimos 5 minutos
    IF EXISTS (
        SELECT 1 FROM comments 
        WHERE email = NEW.email 
        AND post_id = NEW.post_id 
        AND created_at > NOW() - INTERVAL '5 minutes'
    ) THEN
        RAISE EXCEPTION 'Rate limit: Apenas 1 comentário por e-mail a cada 5 minutos';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql;

-- 5. Criar trigger para rate limiting
DROP TRIGGER IF EXISTS check_comment_rate_limit_trigger ON comments;
CREATE TRIGGER check_comment_rate_limit_trigger
    BEFORE INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION check_comment_rate_limit();

-- 6. Verificar configuração final
DO $$
DECLARE
    rls_enabled boolean;
    policy_count integer;
    constraint_exists boolean;
BEGIN
    -- Verificar RLS
    SELECT rowsecurity INTO rls_enabled 
    FROM pg_tables 
    WHERE tablename = 'comments';
    
    -- Verificar políticas
    SELECT count(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'comments';
    
    -- Verificar constraint
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_email_time_unique' 
        AND table_name = 'comments'
    ) INTO constraint_exists;
    
    RAISE NOTICE '=== CONFIGURACAO DE COMENTARIOS ===';
    RAISE NOTICE 'RLS habilitado: %', rls_enabled;
    RAISE NOTICE 'Numero de politicas: %', policy_count;
    RAISE NOTICE 'Constraint de rate limiting: %', constraint_exists;
    
    IF rls_enabled AND policy_count >= 3 AND constraint_exists THEN
        RAISE NOTICE 'Configuracao segura concluida com sucesso!';
        RAISE NOTICE 'Protecoes ativas:';
        RAISE NOTICE '   - Rate limiting por e-mail (5 minutos)';
        RAISE NOTICE '   - Validacoes de conteudo';
        RAISE NOTICE '   - Apenas comentarios aprovados visiveis ao publico';
        RAISE NOTICE '   - Admin com controle total';
    ELSE
        RAISE NOTICE 'Verifique a configuracao manualmente';
    END IF;
    
    RAISE NOTICE '=====================================';
END $$;
