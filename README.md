# Opine Agora SC - React + Vite

Portal de notícias de Santa Catarina construído com React, Vite, Tailwind CSS e Supabase.

## 🚀 Stack Tecnológico

- **Frontend**: React 18+ com Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks & Zustand
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary
- **Authentication**: Supabase Auth
- **Notifications**: React Hot Toast
- **SEO**: React Helmet Async
- **Deployment**: Vercel

## 📋 Funcionalidades

### 🏠 Site Público

- **Homepage**: Destaques, últimas notícias, colunas de opinião
- **Categorias**: Política, Economia, Sociedade, Esportes, Cultura
- **Matérias**: Leitura completa com sistema de comentários e visualização de blocos dinâmicos
- **Compartilhamento**: WhatsApp, Facebook, Twitter, Telegram
- **Design Responsivo**: Mobile-first approach
- **SEO Otimizado**: Meta tags, Open Graph, JSON-LD
- **Contador de Visualizações**: Sistema de tracking em tempo real (RPC)

### 💬 Sistema de Comentários

- **Moderação**: Painel administrativo para aprovação
- **Rate Limiting**: 5 minutos entre comentários por email
- **Validação**: Client-side e server-side
- **Notificações**: Toast notifications para feedback
- **Honeypot Protection**: Proteção contra bots
- **Duplicate Prevention**: Sistema anti-spam robusto

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
- **Drag & Drop**: Reorganização de blocos com @dnd-kit
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

Configure as variáveis no arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### 4. Configure o banco de dados

Execute as migrações SQL no seu Supabase **EM ORDEM** através do SQL Editor:

1. **Setup do Banco de Dados**: `sql-migrations/01_DATABASE_SETUP.sql`
2. **Configuração de Segurança**: `sql-migrations/02_SECURITY_SETUP.sql`
3. **Sistema de Visualizações**: `sql-migrations/24_add_post_view_count.sql`

> ⚠️ **Importante**: Execute os arquivos SQL exatamente nesta ordem para evitar erros de dependência.

### 5. Execute o projeto

```bash
npm run dev
```

Abra http://localhost:5173 no seu navegador.

## 🚀 Deploy na Vercel

Este projeto está configurado para deploy fácil na Vercel.

1.  Faça um fork ou push deste repositório para o GitHub.
2.  Crie um novo projeto na [Vercel](https://vercel.com/new).
3.  Importe o seu repositório.
4.  Configure as **Environment Variables** (copie do seu `.env.local`):
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `VITE_CLOUDINARY_CLOUD_NAME`
    - `VITE_CLOUDINARY_UPLOAD_PRESET`
5.  A **Build Command** (`vite build`) e **Output Directory** (`dist`) devem ser detectados automaticamente.
6.  Clique em **Deploy**.

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build localmente
npm run lint         # Linting do código
```

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
