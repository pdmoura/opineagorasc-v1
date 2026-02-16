-- Políticas RLS para usuários anônimos (complementar à política existente)
-- Permite que usuários não autenticados possam comentar e ver comentários aprovados

-- Política para usuários anônimos inserirem comentários
CREATE POLICY "Allow anonymous insert comments" ON comments
FOR INSERT
WITH CHECK (
  auth.role() = 'anon' AND 
  status = 'pending' AND 
  length(trim(name)) >= 2 AND 
  length(trim(email)) >= 5 AND 
  length(trim(content)) >= 10
);

-- Política para todos lerem comentários aprovados
CREATE POLICY "Allow read approved comments" ON comments
FOR SELECT
USING (status = 'approved');

-- Política para usuários anônimos lerem comentários aprovados
CREATE POLICY "Allow anonymous read approved comments" ON comments
FOR SELECT
USING (
  auth.role() = 'anon' AND 
  status = 'approved'
);

-- Política para usuários autenticados lerem todos os comentários (admin)
CREATE POLICY "Allow authenticated read all comments" ON comments
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

-- Verificar se RLS está habilitado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'comments' 
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE 'RLS não está habilitado na tabela comments. Habilitando...';
    ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  ELSE
    RAISE NOTICE 'RLS já está habilitado na tabela comments.';
  END IF;
END $$;

-- Verificar se a tabela existe com as colunas corretas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' 
    AND column_name = 'status'
  ) THEN
    RAISE EXCEPTION 'Coluna status não encontrada na tabela comments';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' 
    AND column_name = 'post_id'
  ) THEN
    RAISE EXCEPTION 'Coluna post_id não encontrada na tabela comments';
  END IF;
END $$;

-- Conceder permissões necessárias
GRANT SELECT ON comments TO anon;
GRANT INSERT ON comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;
