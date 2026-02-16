-- ========================================
-- ATUALIZAR AUTOR DAS NOTÍCIAS DO CRISTIANO
-- ========================================
-- Substitui "Cristiano Soares" por "Editor-chefe" em todas as matérias

-- 1. Atualizar o campo author em todas as matérias do Cristiano Soares
UPDATE posts 
SET author = 'Editor-chefe'
WHERE author = 'Cristiano Soares';

-- 2. Atualizar também meta_description se contiver o nome
UPDATE posts 
SET meta_description = REPLACE(meta_description, 'Cristiano Soares', 'Editor-chefe')
WHERE meta_description LIKE '%Cristiano Soares%';

-- 3. Atualizar meta_keywords se contiver o nome
UPDATE posts 
SET meta_keywords = REPLACE(meta_keywords, 'Cristiano Soares', 'Editor-chefe')
WHERE meta_keywords LIKE '%Cristiano Soares%';

-- 4. Verificar as alterações
SELECT 'Atualização concluída!' as status;
SELECT COUNT(*) as materias_atualizadas 
FROM posts 
WHERE author = 'Editor-chefe' AND 
      (meta_description LIKE '%Editor-chefe%' OR 
       meta_keywords LIKE '%Editor-chefe%');

-- 5. Mostrar matérias atualizadas
SELECT id, title, author, status, date 
FROM posts 
WHERE author = 'Editor-chefe'
ORDER BY date DESC;
