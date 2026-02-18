# Configuração de Variáveis de Ambiente

Este arquivo descreve todas as variáveis de ambiente necessárias para rodar o Wedding Registry.

## Variáveis Necessárias

### Database Configuration
```
DATABASE_URL=mysql://user:password@host:3306/database
```
Connection string do seu banco de dados MySQL/TiDB.

### Authentication
```
JWT_SECRET=seu-secret-aleatorio-aqui-minimo-32-caracteres
ENCRYPTION_KEY=wedding-registry-encryption-key-32-chars-long!!!
```
Chaves aleatórias para autenticação e criptografia. Gere com: https://www.uuidgenerator.net/

### Stripe Payment Processing
```
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
```
Obtenha em: https://dashboard.stripe.com/apikeys

### Manus OAuth
```
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Nome do Casal
OWNER_OPEN_ID=seu-open-id
```
Fornecido pelo Manus durante a configuração.

### Manus Built-in APIs
```
BUILT_IN_FORGE_API_KEY=sua-chave-api
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```
Fornecido pelo Manus.

### Analytics (Opcional)
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

### Application Customization
```
VITE_APP_TITLE=Wedding Registry - Nossa História
VITE_APP_LOGO=/logo.png
```

## Configuração no Vercel

1. Acesse seu projeto no Vercel
2. Vá para **Settings** → **Environment Variables**
3. Adicione cada variável com seu respectivo valor
4. Certifique-se de marcar: Production, Preview, Development
5. Clique em "Save"
6. Faça um novo commit e push para GitHub
7. O Vercel fará redeploy automaticamente

## Configuração Local

Para desenvolvimento local, crie um arquivo `.env.local` na raiz do projeto com as mesmas variáveis.

**Nunca faça commit do `.env.local`** - ele está no `.gitignore` por segurança.

## Segurança

- Nunca compartilhe suas chaves secretas
- Use chaves de teste (sk_test_, pk_test_) para desenvolvimento
- Use chaves de produção (sk_live_, pk_live_) apenas em produção
- Rotacione suas chaves periodicamente
- Monitore o acesso às variáveis de ambiente
