# Guia de Deployment - Wedding Registry

Este documento descreve como fazer deploy da aplicação Wedding Registry no Vercel.

## Pré-requisitos

1. **Conta no Vercel**: https://vercel.com
2. **Repositório GitHub**: https://github.com/ksalgonzaga-coder/NossaHist-ria.com
3. **Variáveis de Ambiente**: Todas as chaves necessárias

## Passo 1: Conectar Repositório ao Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione "Import Git Repository"
4. Cole a URL: `https://github.com/ksalgonzaga-coder/NossaHist-ria.com`
5. Clique em "Import"

## Passo 2: Configurar Variáveis de Ambiente

No painel do Vercel, vá para **Settings** → **Environment Variables** e adicione:

### Banco de Dados
```
DATABASE_URL=mysql://user:password@host:3306/database
```

### Autenticação
```
JWT_SECRET=seu-secret-aleatorio-aqui-minimo-32-caracteres
ENCRYPTION_KEY=wedding-registry-encryption-key-32-chars-long!!!
```

### Stripe
```
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... para produção)
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... para produção)
```

### OAuth Manus (Fornecido pelo Manus)
```
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Nome do Casal
OWNER_OPEN_ID=seu-open-id
```

### APIs Manus
```
BUILT_IN_FORGE_API_KEY=sua-chave-api
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Customização
```
VITE_APP_TITLE=Wedding Registry - Nossa História
VITE_APP_LOGO=/logo.png
```

## Passo 3: Configurar Domínio Customizado (Opcional)

1. No Vercel, vá para **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Configure os DNS records conforme instruído pelo Vercel

## Passo 4: Deploy

1. Após configurar as variáveis de ambiente, clique em "Deploy"
2. Vercel fará o build automaticamente
3. Aguarde a conclusão (geralmente 2-5 minutos)

## Monitoramento

### Logs de Build
- Acesse **Deployments** para ver logs de build em tempo real
- Se houver erro, revise o log e corrija o problema

### Logs de Runtime
- Acesse **Functions** para ver logs de execução
- Use para debugar erros em produção

## Troubleshooting

### Erro: "Build failed"
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Verifique se o `DATABASE_URL` está correto
3. Revise os logs de build no Vercel

### Erro: "Cannot find module"
1. Execute `pnpm install` localmente
2. Verifique se `package.json` está correto
3. Faça push das mudanças para GitHub

### Erro: "Webhook signature verification failed"
1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Configure o webhook no Stripe apontando para: `https://seu-dominio.vercel.app/api/webhooks/stripe`

### Erro: "Database connection timeout"
1. Verifique se o banco de dados está acessível
2. Confirme que o IP do Vercel está na whitelist do banco
3. Teste a conexão localmente com o mesmo `DATABASE_URL`

## Atualizações

Para fazer deploy de novas mudanças:

1. Faça commit e push para GitHub:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

2. Vercel fará deploy automaticamente quando detectar mudanças na branch `main`

3. Monitore o deployment em https://vercel.com/dashboard

## Rollback

Se algo der errado:

1. Acesse **Deployments** no Vercel
2. Encontre o deployment anterior que funcionava
3. Clique em "Promote to Production"

## Stripe Webhook Setup (Importante!)

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. Configure:
   - **URL**: `https://seu-dominio.vercel.app/api/webhooks/stripe`
   - **Events**: Selecione:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
4. Copie o "Signing secret" e adicione como `STRIPE_WEBHOOK_SECRET` no Vercel

## Performance e Otimizações

- O Vercel usa CDN global para servir assets estáticos
- Imagens são otimizadas automaticamente
- Serverless functions escalam automaticamente

## Suporte

Para problemas com deployment:
1. Revise a documentação do Vercel: https://vercel.com/docs
2. Verifique os logs de build e runtime
3. Contate o suporte do Vercel se necessário
