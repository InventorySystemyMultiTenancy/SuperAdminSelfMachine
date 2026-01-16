# Super Admin Inventory System - Frontend

Sistema de painel administrativo para gerenciamento multi-tenant de inventário.

## 🚀 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL do backend:

```
VITE_API_URL=http://localhost:3001/api
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── services/
│   └── api.js              # Configuração centralizada do Axios
├── contexts/
│   └── AuthContext.jsx     # Context de autenticação
├── hooks/
│   └── useDashboardData.js # Hook para gerenciar dados do dashboard
├── pages/
│   └── SuperAdminPage.jsx  # Página principal do super admin
├── components/
│   ├── Login.jsx           # Componente de login
│   ├── EmpresasTable.jsx   # Tabela de empresas
│   ├── LojasTable.jsx      # Tabela de lojas
│   ├── UsuariosTable.jsx   # Tabela de usuários
│   └── ...                 # Outros componentes
└── App.jsx                 # Componente principal
```

## 🔗 Conexão com Backend

Todas as chamadas HTTP são feitas através da instância centralizada do Axios em `src/services/api.js`.

### Endpoints utilizados:

- `POST /auth/login` - Login de usuário
- `GET /superadmin/empresas` - Listar empresas
- `POST /superadmin/empresas` - Criar empresa
- `PUT /superadmin/empresas/:id` - Atualizar empresa
- `DELETE /superadmin/empresas/:id` - Deletar empresa
- `PATCH /superadmin/empresas/:id/plano` - Atualizar plano
- `PATCH /superadmin/empresas/:id/ativo` - Ativar/desativar empresa
- `GET /lojas` - Listar lojas
- `POST /lojas` - Criar loja
- `PUT /lojas/:id` - Atualizar loja
- `DELETE /lojas/:id` - Deletar loja
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

### Autenticação

O sistema usa JWT (JSON Web Token) para autenticação:

- O token é armazenado no `localStorage` após login
- É automaticamente incluído em todas as requisições via interceptor do Axios
- Em caso de 401 (não autorizado), redireciona para a tela de login

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção localmente
```

## ⚙️ Tecnologias

- **React** - Biblioteca UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

## 📝 Notas Importantes

- **Super Admin Only**: Apenas usuários com role `SUPER_ADMIN` podem acessar o sistema
- **URL do Backend**: Configure corretamente no arquivo `.env`
- **Token JWT**: Armazenado no localStorage e incluído automaticamente em requisições
