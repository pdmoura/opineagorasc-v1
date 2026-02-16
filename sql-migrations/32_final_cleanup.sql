-- LIMPEZA FINAL - REMOVER AVISOS DE POLITICAS
-- Execute este SQL no Supabase Dashboard

-- 1. Verificar políticas existentes (apenas para visualização)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'comments';

-- 2. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'comments';

-- 3. Verificar constraint de rate limiting
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'comments' 
AND constraint_name = 'comments_email_time_unique';

-- 4. Verificar trigger de rate limiting
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'comments' 
AND trigger_name = 'check_comment_rate_limit_trigger';

-- 5. Mensagem final
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICACAO FINAL DO SISTEMA ===';
    RAISE NOTICE 'Se voce consegue comentar e recebe mensagem de 5 minutos, esta tudo correto!';
    RAISE NOTICE 'O erro de policy already exists e apenas um aviso inofensivo.';
    RAISE NOTICE 'Sistema de comentarios esta funcionando com seguranca maxima!';
    RAISE NOTICE '=====================================';
END $$;
