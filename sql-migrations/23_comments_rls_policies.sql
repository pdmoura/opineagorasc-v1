-- Políticas RLS para a tabela comments
-- Permitir que usuários anônimos possam inserir comentários (com status pending)
-- Permitir que qualquer pessoa leia comentários aprovados
-- Permitir que administradores gerenciem todos os comentários

-- 1. Permitir inserção de comentários para qualquer usuário (anônimos incluídos)
-- Comentários serão inseridos com status "pending" para moderação
CREATE POLICY "Allow anonymous insert comments" ON comments
FOR INSERT
WITH CHECK (
  status = 'pending' AND 
  length(name) >= 2 AND 
  length(email) >= 5 AND 
  length(content) >= 10
);

-- 2. Permitir leitura de comentários aprovados para qualquer pessoa
CREATE POLICY "Allow read approved comments" ON comments
FOR SELECT
USING (status = 'approved');

-- 3. Permitir que administradores leiam todos os comentários
CREATE POLICY "Allow admin read all comments" ON comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@opineagora.com.br'
  )
);

-- 4. Permitir que administradores atualizem qualquer comentário
CREATE POLICY "Allow admin update all comments" ON comments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@opineagora.com.br'
  )
);

-- 5. Permitir que administradores excluam qualquer comentário
CREATE POLICY "Allow admin delete all comments" ON comments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@opineagora.com.br'
  )
);

-- 6. Permitir que usuários atualizem seus próprios comentários (apenas para edição futura)
CREATE POLICY "Allow users update own comments" ON comments
FOR UPDATE
USING (
  auth.uid()::text = user_id AND 
  status = 'pending'
);

-- 7. Permitir que usuários excluam seus próprios comentários pendentes
CREATE POLICY "Allow users delete own pending comments" ON comments
FOR DELETE
USING (
  auth.uid()::text = user_id AND 
  status = 'pending'
);
