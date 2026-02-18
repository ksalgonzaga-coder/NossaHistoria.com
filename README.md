# 💍 Wedding Registry - Nossa História

Uma plataforma elegante e moderna de lista de presentes para casamento onde convidados podem selecionar presentes que se convertem em contribuições monetárias diretas para o casal.

## ✨ Características

### Para Convidados
- **Catálogo de Presentes**: Navegue por presentes organizados com filtros e busca
- **Múltiplas Opções de Pagamento**: Cartão de crédito, débito e PIX via Stripe
- **Contribuição Livre**: Escolha qualquer valor para contribuir
- **Mural de Mensagens**: Deixe mensagens e fotos para o casal
- **Galeria de Eventos**: Veja fotos do evento, comente e dê likes
- **Design Responsivo**: Funciona perfeitamente em mobile e desktop

### Para o Casal (Admin)
- **Dashboard Exclusivo**: Visualize saldo total, histórico de transações e gráficos
- **Painel Administrativo**: Gerencie produtos, fotos do carrossel e posts
- **Gerenciamento de Dados Bancários**: Configure informações para receber contribuições
- **Autenticação Segura**: Login com email e senha criptografada
- **Transações em Tempo Real**: Webhook do Stripe para confirmação instantânea

## 🔒 Segurança

- **Criptografia AES-256-GCM**: Dados sensíveis criptografados em repouso
- **Hash Scrypt**: Senhas com salt aleatório
- **Rate Limiting**: Proteção contra brute force (5 tentativas/15 min)
- **Stripe PCI Compliant**: Nenhum dado de cartão armazenado localmente
- **Validação de Entrada**: Todos os inputs validados com Zod
- **HTTPS/TLS**: Comunicação criptografada em trânsito

Veja [SECURITY.md](./SECURITY.md) para detalhes completos.

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Repositório GitHub sincronizado
3. Variáveis de ambiente configuradas

### Passos para Deploy

1. **Conectar Repositório ao Vercel**
   - Acesse https://vercel.com/dashboard
   - Clique em "Add New..." → "Project"
   - Selecione "Import Git Repository"
   - Cole: `https://github.com/ksalgonzaga-coder/NossaHist-ria.com`

2. **Configurar Variáveis de Ambiente**
   - Vá para **Settings** → **Environment Variables**
   - Adicione todas as variáveis listadas em [DEPLOYMENT.md](./DEPLOYMENT.md)

3. **Deploy**
   - Clique em "Deploy"
   - Aguarde a conclusão (2-5 minutos)

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Node.js + Express + tRPC
- **Banco de Dados**: MySQL/TiDB
- **Autenticação**: OAuth Manus + Login Admin com Scrypt
- **Pagamentos**: Stripe (Cartão + PIX)
- **Armazenamento**: AWS S3
- **Testes**: Vitest (40+ testes)

## 📦 Desenvolvimento Local

### Instalação
```bash
pnpm install
```

### Desenvolvimento
```bash
pnpm dev
```
Acesse http://localhost:3000

### Build para Produção
```bash
pnpm build
pnpm start
```

### Testes
```bash
pnpm test
```

### Verificação de Tipos
```bash
pnpm check
```

## 📋 Estrutura do Projeto

```
wedding-registry/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
│   └── public/            # Assets estáticos
├── server/                # Backend Node.js
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database helpers
│   └── _core/             # Framework core
├── drizzle/               # Schema e migrations
├── storage/               # S3 helpers
└── shared/                # Código compartilhado
```

## 🔐 Credenciais Admin

Para acessar o painel administrativo:
- **Email**: ksalgonzaga@gmail.com
- **Senha**: Ksal2301!

⚠️ **Importante**: Mude a senha após o primeiro login!

## 📊 Funcionalidades Principais

### Homepage
- Carrossel de fotos do casal
- Seção de mensagens
- Cards de navegação para as principais seções
- Footer com redes sociais

### Catálogo de Presentes
- Filtros por categoria
- Busca por nome
- Seleção de quantidade
- Redirecionamento automático para checkout

### Checkout
- Múltiplas opções de pagamento
- Integração com Stripe
- Confirmação em tempo real
- Recibos por email

### Mural de Mensagens
- Upload de fotos
- Postagem de mensagens
- Visualização de todas as contribuições

### Galeria de Eventos
- Upload de fotos (admin only)
- Sistema de likes
- Comentários dos convidados
- Download de fotos

### Dashboard do Casal
- Saldo total acumulado
- Histófico de transações
- Gráficos mensais
- Estatísticas de produtos
- Gerenciamento de dados bancários

## 🐛 Troubleshooting

### Erro de Build no Vercel
Veja a seção "Troubleshooting" em [DEPLOYMENT.md](./DEPLOYMENT.md)

### Problemas Locais
1. Limpe o cache: `rm -rf dist node_modules/.vite`
2. Reinstale dependências: `pnpm install`
3. Reinicie o servidor: `pnpm dev`

## 📞 Suporte

Para problemas ou sugestões:
- Email: ksalgonzaga@gmail.com
- GitHub Issues: https://github.com/ksalgonzaga-coder/NossaHist-ria.com/issues

## 📄 Licença

MIT - Veja LICENSE para detalhes

## 🎉 Próximas Melhorias

- [ ] Notificações por email
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Integração com redes sociais
- [ ] Sistema de cupons/descontos
- [ ] Convites personalizados
- [ ] Análise avançada de contribuições

---

Desenvolvido com ❤️ para casamentos especiais
