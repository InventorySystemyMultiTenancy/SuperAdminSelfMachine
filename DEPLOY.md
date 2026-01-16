# Configuração para deploy em produção (Render, Vercel, Netlify, etc)

## ⚠️ CRÍTICO - Erro 404 ao acessar /login

Se você está recebendo **404** ao acessar rotas como `/login` ou `/superadmin`, é porque o servidor **não está configurado para SPA routing**.

Este projeto usa **React Router** - todas as rotas (`/login`, `/superadmin`) são gerenciadas no cliente. O servidor DEVE redirecionar TODAS as rotas para `index.html`.

---

## Para Render.com

Crie um arquivo `render.yaml` na raiz do projeto ou configure manualmente:

### Build Command:

```
npm install && npm run build
```

### Publish Directory:

```
dist
```

### Variáveis de Ambiente:

```
VITE_API_URL=https://toylandbackend.onrender.com/api
```

### Rewrite Rules (Configurar no dashboard da Render):

Para suportar React Router, adicione:

```
/*  /index.html  200
```

---

## Para Vercel

Crie `vercel.json` na raiz:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "env": {
    "VITE_API_URL": "https://toylandbackend.onrender.com/api"
  }
}
```

---

## Para Netlify

Crie `_redirects` na pasta `public/`:

```
/*  /index.html  200
```

E configure as variáveis de ambiente no dashboard da Netlify:

```
VITE_API_URL=https://toylandbackend.onrender.com/api
```

---

## Importante!

⚠️ **Nunca comite o arquivo `.env`** com dados sensíveis!

✅ Configure as variáveis de ambiente direto no painel do seu provedor de hospedagem.
