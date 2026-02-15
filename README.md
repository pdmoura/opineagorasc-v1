# 📰 Opine Agora SC

> Portal de notícias dinâmico focado em Santa Catarina com CMS avançado e moderação de comentários

Um portal de notícias moderno construído com arquitetura monolítica, oferecendo um site público com Server-Side Rendering (SSR) para excelente indexação SEO e um painel administrativo completo para gestão de conteúdo.

---

## 🚀 Funcionalidades

### 📝 Editor de Blocos Dinâmico (CMS)

- Sistema avançado de criação de matérias com blocos modulares
- Tipos de blocos: Capa, Texto, Imagem Full, Imagem+Texto, Vídeo YouTube, Anúncios AdSense, Botões
- Estrutura de conteúdo salva em JSON no banco de dados
- Drag-and-drop para reordenação de blocos
- Preview em tempo real

### 💬 Sistema de Comentários com Moderação

- Comentários públicos com validação client-side e server-side
- Rate Limit por IP (máximo 10 comentários a cada 24 horas)
- Painel de moderação completo: Aprovar, Rejeitar ou Remover
- Contador de comentários pendentes no admin
- Notificações toast para feedback imediato

### 📢 Gestão de Anúncios

- Criação e gerenciamento de áreas publicitárias
- Categorização de anúncios
- Upload de imagens via Cloudinary

### 🔗 Compartilhamento Social

- Links dinâmicos para WhatsApp, Facebook, X (Twitter) e Telegram
- URLs otimizadas com título e link da matéria

### 🔐 Painel Administrativo

- Interface intuitiva para gestão completa
- Gerenciamento de posts e anúncios
- Moderação de comentários (pendentes e aprovados)
- Sistema de autenticação via Supabase

---

## 🛠️ Tecnologias Utilizadas

### Backend

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
