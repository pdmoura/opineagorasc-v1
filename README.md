# Opine Agora SC - React + Vite

Portal de notícias de Santa Catarina construído com React, Vite, Tailwind CSS e Supabase.

## 🚀 Stack Tecnológico

- **Frontend**: React 18+ com Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
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
- **Matérias**: Leitura completa com sistema de comentários
- **Compartilhamento**: WhatsApp, Facebook, Twitter, Telegram
- **Design Responsivo**: Mobile-first approach
- **SEO Otimizado**: Meta tags, Open Graph, JSON-LD
- **Contador de Visualizações**: Sistema de tracking em tempo real

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
- **Drag & Drop**: Reorganização de blocos
- **Preview**: Visualização em tempo real
- **Auto-save**: Salvamento automático

### �️ Sistema de Visualizações

- **Contagem em Tempo Real**: Visualizações atualizadas instantaneamente
- **Sessão Única**: Previne múltiplas contagens do mesmo usuário
- **Analytics Dashboard**: Estatísticas de visualização por post
- **Performance Otimizada**: Sistema eficiente com cache e índices

## �🛠️ Instalação e Configuração

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

Execute as migrações SQL no seu Supabase **EM ORDEM**:

1. **Setup do Banco de Dados**:
    - Execute o conteúdo do arquivo: `sql-migrations/01_DATABASE_SETUP.sql`

2. **Configuração de Segurança**:
    - Execute o conteúdo do arquivo: `sql-migrations/02_SECURITY_SETUP.sql`

3. **Sistema de Visualizações**:
    - Execute o conteúdo do arquivo: `sql-migrations/24_add_post_view_count.sql`

> ⚠️ **Importante**: Execute os arquivos SQL exatamente nesta ordem para evitar erros.

### 5. Execute o projeto

```bash
npm run dev
```

Abra http://localhost:5173 no seu navegador.

## 📁 Estrutura do Projeto

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

## 🚀 Deploy

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

## 🔒 Segurança

- **RLS (Row Level Security)**: Políticas de acesso no Supabase
- **Rate Limiting**: Proteção contra spam de comentários
- **Input Validation**: Validação client-side e server-side
- **Honeypot Protection**: Campo oculto para detectar bots
- **XSS Protection**: Sanitização de inputs
- **HTTPS**: Forçado em produção
- **Safe Functions**: Funções SQL seguras para inserção de dados

## ⚡ Performance

- **Code Splitting**: Lazy loading de componentes
- **Image Optimization**: Cloudinary transformations
- **Debouncing**: Inputs de busca e filtros
- **Caching**: Estratégias de cache do browser
- **Minification**: Build otimizado para produção
- **View Tracking**: Sistema eficiente de contagem de visualizações

## 🔧 Debugging e Troubleshooting

### Problemas Comuns

1. **Toast duplicados**: Resolvido com ref-based tracking
2. **Comentários não aparecem**: Verifique políticas RLS no Supabase
3. **Build falha**: Verifique variáveis de ambiente
4. **Imagens não carregam**: Confirme configuração Cloudinary
5. **Visualizações não contam**: Verifique funções RPC e coluna view_count

### Logs e Monitoramento

- React DevTools para debugging de componentes
- Supabase Dashboard para monitoramento do banco
- Browser DevTools para debugging de rede

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
