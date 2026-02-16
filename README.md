# Opine Agora SC - React + Vite

Portal de notícias de Santa Catarina construído com React, Vite, Tailwind CSS e Supabase.

## 🚀 Stack Tecnológico

- **Frontend**: React 18+ com Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API + Zustand
- **Forms**: React Hook Form
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📋 Funcionalidades

### 🏠 Site Público

- **Homepage**: Destaques, últimas notícias, colunas de opinião
- **Categorias**: Política, Economia, Sociedade, Esportes, Cultura
- **Matérias**: Leitura completa com sistema de comentários
- **Compartilhamento**: WhatsApp, Facebook, Twitter, Telegram
- **Design Responsivo**: Mobile-first approach
- **SEO Otimizado**: Meta tags, Open Graph, JSON-LD

### 💬 Sistema de Comentários

- **Moderação**: Painel administrativo para aprovação
- **Rate Limiting**: 10 comentários por IP a cada 24 horas
- **Validação**: Client-side e server-side
- **Notificações**: Toast notifications para feedback

### 🎛️ Painel Administrativo

- **Autenticação**: Login seguro com Supabase Auth
- **Gestão de Matérias**: CRUD completo com editor de blocos
- **Moderação**: Aprovação/rejeição de comentários
- **Anúncios**: Sistema de gestão de publicidade
- **Dashboard**: Estatísticas e informações rápidas

### 📝 Editor de Blocos (CMS)

- **Tipos de Bloco**:
    - Capa (imagem + título)
    - Texto (rich text)
    - Imagem Completa
    - Imagem + Texto (lado a lado)
    - Vídeo YouTube
    - Botões (CTA)
    - Anúncios (AdSense)
- **Drag & Drop**: Reorganização de blocos
- **Preview**: Visualização em tempo real
- **Auto-save**: Salvamento automático

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <repository-url>
cd opine-agora-sc-react
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### 4. Configure o banco de dados

Execute as migrações SQL no seu Supabase na ordem correta:

1. **Adicionar coluna slug**:

```sql
-- Execute o conteúdo do arquivo: sql-migrations/add_slug_column.sql
```

2. **Adicionar colunas de status**:

```sql
-- Execute o conteúdo do arquivo: sql-migrations/add_comment_status.sql
-- Execute o conteúdo do arquivo: sql-migrations/add_ads_columns.sql
```

3. **Configurar RLS Policies**:

```sql
-- Execute o conteúdo do arquivo: sql-migrations/rls_policies.sql
```

### 5. Execute o projeto

```bash
npm run dev
```

Abra http://localhost:5173 no seu navegador.

## � Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # Componentes administrativos
│   ├── public/         # Componentes públicos
│   └── shared/         # Componentes compartilhados
├── pages/              # Páginas da aplicação
│   ├── admin/         # Páginas administrativas
│   ├── Home.jsx       # Homepage
│   ├── Post.jsx       # Página da matéria
│   ├── Category.jsx   # Página de categoria
│   └── Login.jsx      # Página de login
├── hooks/             # Hooks customizados
├── lib/               # Utilitários e configurações
├── context/           # Context providers
├── App.jsx            # Componente principal
├── main.jsx           # Entry point
└── index.css          # Estilos globais
```

## 🎨 Personalização

### Cores e Tema

As cores principais estão definidas no `tailwind.config.js`:

- `navy`: #1a365d
- `teal-primary`: #008080
- `orange-warm`: #ff6b35

### Componentes

- **PostCard**: Card de matéria com múltiplas variantes
- **Header**: Navegação responsiva com busca
- **Footer**: Links sociais e newsletter
- **CommentForm**: Formulário de comentários
- **CommentList**: Lista de comentários aprovados

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## � Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel
3. Deploy automático em cada push para main

### Outras plataformas

O projeto pode ser deployado em qualquer plataforma que suporte React/Vite:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## � Segurança

- **RLS (Row Level Security)**: Políticas de acesso no Supabase
- **Rate Limiting**: Proteção contra spam de comentários
- **Input Validation**: Validação client-side e server-side
- **XSS Protection**: Sanitização de inputs
- **HTTPS**: Forçado em produção

## � Performance

- **Code Splitting**: Lazy loading de componentes
- **Image Optimization**: Cloudinary transformations
- **Debouncing**: Inputs de busca e filtros
- **Caching**: Estratégias de cache do browser
- **Minification**: Build otimizado para produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a ISC License.

## 📞 Suporte

Para dúvidas ou suporte:

- Email: contato@opineagora.com.br
- Issues no GitHub

---

**Desenvolvido com ❤️ para Santa Catarina**

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **EJS** - Template engine para SSR

### Frontend

- **Vanilla JavaScript** - Arquitetura modular sem frameworks
- **CSS Puro** - Estilização customizada
- **Vite** - Build tool para empacotamento e minificação

### Infraestrutura

- **Supabase** - Banco de dados PostgreSQL e autenticação
- **Cloudinary** - Storage e otimização de imagens
- **Render.com** - Hospedagem e deploy

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=seu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=seu-upload-preset
```

> ⚠️ **Importante:** Nunca commite o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Conta no Cloudinary (gratuita)

### Passo a Passo

1. **Clone o repositório**

    ```bash
    git clone https://github.com/seu-usuario/opine-agora-sc.git
    cd opine-agora-sc
    ```

2. **Instale as dependências**

    ```bash
    npm install
    ```

3. **Configure as variáveis de ambiente**
    - Copie o arquivo `.env.example` para `.env`
    - Preencha com suas credenciais do Supabase e Cloudinary

4. **Configure o banco de dados**
    - Acesse seu projeto no Supabase
    - Execute os scripts SQL necessários para criar as tabelas:
        - `posts` (id, title, excerpt, content, category, author, image, date, featured)
        - `ads` (id, title, description, contact, category, image, date)
        - `comments` (id, post_id, name, email, content, status, ip_address, created_at)

5. **Inicie o servidor de desenvolvimento**

    ```bash
    npm run dev
    ```

6. **Acesse a aplicação**
    - Site público: `http://localhost:3000`
    - Painel admin: `http://localhost:3000/admin`
    - Login: `http://localhost:3000/login`

---

## 📁 Estrutura do Projeto

```
opine-agora-sc/
├── public/                 # Arquivos estáticos
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript modular
│   │   └── modules/       # Módulos (api, editor, ui-admin, ui-public, utils)
│   └── dist/              # Build de produção (gerado pelo Vite)
├── views/                 # Templates EJS
│   ├── pages/             # Páginas (index, post, admin, login)
│   └── partials/          # Componentes reutilizáveis (header, footer, head)
├── server.js              # Servidor Express principal
├── vite.config.js         # Configuração do Vite
├── package.json           # Dependências e scripts
└── .env                   # Variáveis de ambiente (não versionado)
```

### Arquivos Principais

- **`server.js`** - Servidor Express com todas as rotas (API e páginas)
- **`public/js/modules/`** - Módulos JavaScript organizados por responsabilidade
    - `api.js` - Comunicação com Supabase e APIs
    - `editor.js` - Editor de blocos do CMS
    - `ui-admin.js` - Interface do painel administrativo
    - `ui-public.js` - Interface pública
    - `utils.js` - Funções utilitárias (toast, formatação)

---

## ☁️ Deploy no Render.com

### Configuração Rápida

1. **Conecte seu repositório GitHub**
    - Acesse [Render.com](https://render.com)
    - Clique em "New +" → "Web Service"
    - Conecte seu repositório privado do GitHub

2. **Configure o serviço**
    - **Name:** opine-agora-sc (ou nome de sua preferência)
    - **Environment:** Node
    - **Build Command:** `npm run build`
    - **Start Command:** `npm start`
    - **Plan:** Free

3. **Adicione as variáveis de ambiente**
    - No painel do Render, vá em "Environment"
    - Adicione todas as variáveis do arquivo `.env`:
        - `NODE_ENV=production`
        - `VITE_SUPABASE_URL`
        - `VITE_SUPABASE_ANON_KEY`
        - `VITE_CLOUDINARY_CLOUD_NAME`
        - `VITE_CLOUDINARY_UPLOAD_PRESET`

4. **Deploy**
    - Clique em "Create Web Service"
    - O Render fará o build e deploy automaticamente
    - Aguarde alguns minutos até o serviço ficar online

### URL de Produção

Após o deploy, sua aplicação estará disponível em:

```
https://seu-app.onrender.com
```

---

## ⏰ Estratégia de "Keep-Alive"

### Problema

O plano gratuito do Render.com coloca serviços inativos em modo "sleep" após 15 minutos sem requisições, causando cold starts de até 50 segundos na próxima visita.

### Solução Implementada

Configuramos um sistema de ping automático usando **cron-job.org** para manter o servidor sempre ativo:

#### 1. Rota de Health Check

Criamos uma rota leve e otimizada em `/health` que:

- ✅ Retorna resposta JSON instantânea
- ✅ Não acessa banco de dados
- ✅ Não renderiza templates EJS
- ✅ Consome recursos mínimos

```javascript
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
```

#### 2. Configuração do Cron-Job

1. Acesse [cron-job.org](https://cron-job.org) e crie uma conta gratuita
2. Crie um novo cron job com as seguintes configurações:
    - **Title:** Opine Agora SC Keep-Alive
    - **URL:** `https://seu-app.onrender.com/health`
    - **Schedule:** A cada 10 minutos (`*/10 * * * *`)
    - **Request method:** GET
    - **Enabled:** ✅ Yes

#### Benefícios

- 🚀 **Tempo de resposta instantâneo** para todos os usuários
- 💰 **Zero custo adicional** (plano gratuito do cron-job.org)
- ⚡ **Sem sobrecarga** no banco de dados ou servidor
- 📊 **Monitoramento incluído** via dashboard do cron-job.org

> **Nota:** Com esta estratégia, o servidor nunca entra em sleep mode, garantindo experiência de usuário equivalente a servidores pagos.

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento (Vite dev server + Nodemon)
npm run dev

# Build de produção (minificação e otimização)
npm run build

# Iniciar servidor de produção
npm start

# Preview do build localmente
npm run preview
```

---

## 🤝 Contribuindo

Este é um projeto freelancer privado. Para sugestões ou melhorias, entre em contato com o desenvolvedor.

---

## 📄 Licença

Projeto proprietário - Todos os direitos reservados © 2026

---

## 🔧 Suporte

Para questões técnicas ou suporte, entre em contato através do email do projeto.

---

**Desenvolvido com ❤️ para Santa Catarina**
