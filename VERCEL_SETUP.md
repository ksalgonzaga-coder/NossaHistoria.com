# Configuração do Vercel para Repositório Privado

Este guia explica como configurar o Vercel para fazer deploy de um repositório GitHub privado.

## Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Repositório privado no GitHub
- Acesso de administrador ao repositório

## Passo 1: Reconectar o GitHub no Vercel

Se você já tem um projeto no Vercel que não está funcionando:

1. Acesse https://vercel.com/dashboard
2. Clique no seu projeto "NossaHistoria.com"
3. Vá para **Settings** (engrenagem no topo)
4. Clique em **"Git"** no menu esquerdo
5. Clique em **"Disconnect GitHub"**
6. Confirme a desconexão

## Passo 2: Reconectar com Permissões Corretas

1. Ainda em **Settings** → **Git**
2. Clique em **"Connect Git Repository"**
3. Selecione **"GitHub"**
4. **Importante**: Quando o GitHub pedir permissões, certifique-se de:
   - Marcar a opção "All repositories" OU
   - Selecionar especificamente "NossaHistoria.com"
   - Clique em **"Authorize vercel"** ou **"Install"**

5. De volta ao Vercel, selecione:
   - **Owner**: ksalgonzaga-coder
   - **Repository**: NossaHistoria.com
   - Clique em **"Connect"**

## Passo 3: Configurar Variáveis de Ambiente

1. Em **Settings**, clique em **"Environment Variables"**
2. Adicione cada variável necessária:

```
DATABASE_URL=sua_connection_string
JWT_SECRET=seu_secret_aleatorio
ENCRYPTION_KEY=sua_chave_encriptacao
STRIPE_SECRET_KEY=sua_chave_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_stripe
VITE_APP_ID=seu_app_id
VITE_APP_TITLE=Wedding Registry - Nossa História
VITE_APP_LOGO=/logo.png
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Nome do Casal
OWNER_OPEN_ID=seu_open_id
BUILT_IN_FORGE_API_KEY=sua_chave_api
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

3. Para cada variável:
   - Clique em **"Add New"**
   - Digite o **Name** (ex: DATABASE_URL)
   - Digite o **Value**
   - Marque: Production, Preview, Development
   - Clique em **"Save"**

## Passo 4: Fazer Deploy

1. Vá para **Deployments** no Vercel
2. Clique nos **3 pontos** (⋮) do último deployment
3. Clique em **"Redeploy"**

O Vercel fará o build com as variáveis configuradas.

## Solução de Problemas

### "Repository not found"
- Verifique se o GitHub está conectado corretamente
- Tente desconectar e reconectar
- Certifique-se de que o Vercel tem acesso ao repositório

### "Build failed"
- Verifique os logs de build no Vercel
- Confirme que todas as variáveis de ambiente estão corretas
- Teste o build localmente com: `pnpm build`

### "Environment variables not found"
- Certifique-se de que as variáveis estão configuradas
- Verifique se estão marcadas para "Production"
- Faça um novo redeploy após adicionar variáveis

## Segurança

- Nunca compartilhe seus tokens ou chaves
- Use chaves de teste (sk_test_) para desenvolvimento
- Rotacione suas chaves periodicamente
- Monitore o acesso ao seu repositório

## Próximos Passos

Após o deploy bem-sucedido:
1. Acesse sua URL do Vercel
2. Configure seu domínio customizado (opcional)
3. Configure o webhook do Stripe para pagamentos
4. Teste todas as funcionalidades

Para mais informações sobre Vercel: https://vercel.com/docs
