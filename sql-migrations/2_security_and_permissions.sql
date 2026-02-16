-- ========================================
-- 02. SECURITY AND PERMISSIONS SETUP (VERSÃO FINAL)
-- ========================================

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas antigas 
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated management" ON posts;
DROP POLICY IF EXISTS "Admin full access" ON posts;
DROP POLICY IF EXISTS "Public read posts" ON posts;

DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON comments;

DROP POLICY IF EXISTS "Public can read approved ads" ON ads;
DROP POLICY IF EXISTS "Authenticated users can manage ads" ON ads;

-- 3. Políticas para MATÉRIAS (Posts)
-- Público vê apenas os que estão com status 'published'
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Usuários Logados podem fazer o que quiserem (Criar, Editar, Deletar)
CREATE POLICY "Authenticated users can manage posts" ON posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Políticas para COMENTÁRIOS (Comments)
-- Público vê apenas comentários aprovados
CREATE POLICY "Public can read approved comments" ON comments
  FOR SELECT USING (status = 'approved');

-- Qualquer um na internet pode enviar um comentário (ficará como pending)
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (
    status = 'pending' AND
    length(name) >= 2 AND
    length(name) <= 100 AND
    length(content) >= 10 AND
    length(content) <= 2000
  );

-- Usuários Logados podem gerenciar (aprovar/rejeitar) os comentários
CREATE POLICY "Authenticated users can manage comments" ON comments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Políticas para ANÚNCIOS (Ads)
-- Público vê apenas os aprovados
CREATE POLICY "Public can read approved ads" ON ads
  FOR SELECT USING (status = 'approved');

-- Usuários Logados podem gerenciar anúncios
CREATE POLICY "Authenticated users can manage ads" ON ads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Opcional: Função de limite de taxa para evitar Spam de Comentários
CREATE OR REPLACE FUNCTION check_comment_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM comments 
        WHERE email = NEW.email 
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '5 minutes'
    ) THEN
        RAISE EXCEPTION 'Você pode comentar apenas uma vez a cada 5 minutos';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o limitador de Spam
DROP TRIGGER IF EXISTS trigger_comment_rate_limit ON comments;
CREATE TRIGGER trigger_comment_rate_limit
    BEFORE INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION check_comment_rate_limit();

-- Mensagem de confirmação
SELECT 'Segurança configurada com sucesso e pronta para uso!' as result;