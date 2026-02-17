# Guia de Configuração de Pagamentos

Este guia ajudará você a configurar corretamente o sistema de pagamentos do seu site de casamento.

## 1. Configuração Inicial do Stripe

### Passo 1: Acessar o Sandbox do Stripe

1. Você recebeu um link para ativar seu sandbox do Stripe
2. Acesse: https://dashboard.stripe.com/claim_sandbox/
3. **Importante**: Ative o sandbox ANTES de 2026-04-18 (data limite fornecida)

### Passo 2: Configurar Informações da Conta

1. Faça login no [Dashboard do Stripe](https://dashboard.stripe.com)
2. Vá para **Settings** → **Account Settings**
3. Preencha suas informações:
   - Nome completo
   - Email
   - Endereço
   - Telefone

## 2. Configurar Chaves de API

### Obter Chaves do Stripe

1. No Dashboard do Stripe, vá para **Developers** → **API Keys**
2. Você verá duas chaves:
   - **Publishable Key** (começa com `pk_`)
   - **Secret Key** (começa com `sk_`)

### Adicionar Chaves no Site

1. Acesse o painel de **Settings** do seu site de casamento
2. Vá para **Payment** (Pagamento)
3. Cole as chaves:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Cole a Publishable Key
   - `STRIPE_SECRET_KEY`: Cole a Secret Key

## 3. Configurar Webhooks

Os webhooks permitem que o site receba confirmações de pagamento do Stripe.

### Criar Webhook

1. No Dashboard do Stripe, vá para **Developers** → **Webhooks**
2. Clique em **Add Endpoint**
3. URL do Webhook: `https://seu-site.manus.space/api/stripe/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `charge.refunded`
5. Clique em **Add Endpoint**

### Obter Webhook Secret

1. Após criar o webhook, clique nele para abrir os detalhes
2. Copie o **Signing Secret** (começa com `whsec_`)
3. Adicione no painel de **Settings** → **Payment**:
   - `STRIPE_WEBHOOK_SECRET`: Cole o Signing Secret

## 4. Testar Pagamentos (Modo Teste)

### Cartões de Teste

Use estes números de cartão para testar:

**Cartão de Crédito Válido:**
- Número: `4242 4242 4242 4242`
- Expiração: Qualquer data futura (ex: 12/25)
- CVC: Qualquer 3 dígitos (ex: 123)

**Cartão que Falha:**
- Número: `4000 0000 0000 0002`
- Expiração: Qualquer data futura
- CVC: Qualquer 3 dígitos

### Testar Contribuição

1. Acesse seu site
2. Vá para "Ver Presentes" ou "Contribuir Livremente"
3. Preencha os dados
4. Use um dos cartões de teste acima
5. Verifique no Dashboard do Stripe se a transação apareceu

## 5. Configurar Informações Bancárias (Para Receber Dinheiro)

### Adicionar Conta Bancária

1. No Dashboard do Stripe, vá para **Settings** → **Bank Accounts**
2. Clique em **Add Bank Account**
3. Preencha:
   - Nome do banco
   - Número da conta
   - Dígito verificador
   - CPF/CNPJ

### Configurar Transferências Automáticas

1. Vá para **Settings** → **Payouts**
2. Configure:
   - **Payout Schedule**: Escolha frequência (diária, semanal, mensal)
   - **Payout Method**: Selecione sua conta bancária

## 6. Migrar para Produção (Chaves Reais)

Quando estiver pronto para receber pagamentos reais:

### Passo 1: Verificação KYC

1. Stripe pedirá verificação de identidade
2. Forneça os documentos solicitados
3. Aguarde aprovação (geralmente 24-48 horas)

### Passo 2: Obter Chaves de Produção

1. Após aprovação, vá para **Developers** → **API Keys**
2. Alterne para **Live Data** (ao invés de Test Data)
3. Copie as chaves de produção

### Passo 3: Atualizar Chaves no Site

1. Acesse **Settings** → **Payment**
2. Substitua as chaves de teste pelas chaves de produção
3. Salve as alterações

## 7. Configurar PIX (Opcional)

Para aceitar PIX como método de pagamento:

### Adicionar Chave PIX

1. No Dashboard do Stripe, vá para **Settings** → **Payment Methods**
2. Ative **PIX**
3. Adicione sua chave PIX:
   - CPF
   - Email
   - Telefone
   - Chave aleatória (gerada automaticamente)

## 8. Troubleshooting

### Pagamento não aparece no site

1. Verifique se o webhook está configurado corretamente
2. Acesse **Developers** → **Webhooks** e verifique os logs
3. Procure por erros em **Events**

### Erro "Chave inválida"

1. Verifique se copiou a chave corretamente (sem espaços)
2. Certifique-se de usar a chave correta (Publishable vs Secret)
3. Confirme que está usando chaves do ambiente correto (Test vs Live)

### Transferência não foi recebida

1. Verifique se a conta bancária está verificada
2. Acesse **Settings** → **Payouts** para ver histórico
3. Procure por erros em **Payout Failures**

## 9. Suporte

Para mais informações:

- [Documentação do Stripe](https://stripe.com/docs)
- [Suporte do Stripe](https://support.stripe.com)
- [Comunidade Stripe](https://stripe.com/community)

## 10. Dicas Importantes

✅ **Faça:**
- Ativar o sandbox ANTES da data limite
- Testar pagamentos antes de publicar
- Manter as chaves seguras
- Configurar webhooks corretamente
- Fazer backup das chaves

❌ **Não faça:**
- Compartilhar as chaves Secret com ninguém
- Commitar as chaves no Git
- Usar chaves de teste em produção
- Ignorar erros de webhook

---

**Última atualização:** Fevereiro de 2026
