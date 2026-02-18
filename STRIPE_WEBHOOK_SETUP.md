# Configuração do Webhook do Stripe

Este guia explica como configurar o webhook do Stripe para confirmar pagamentos automaticamente e atualizar o saldo do casal em tempo real.

## O que é um Webhook?

Um webhook é um mecanismo que permite que o Stripe envie notificações para seu servidor quando eventos importantes ocorrem, como quando um pagamento é concluído, falha ou é reembolsado. Isso permite que você atualize automaticamente o status das transações sem precisar fazer consultas constantes à API do Stripe.

## Configuração no Stripe Dashboard

### 1. Acessar Webhooks

1. Acesse [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Você verá uma lista de webhooks configurados (se houver)
3. Clique no botão **"Add endpoint"** para adicionar um novo webhook

### 2. Configurar o Endpoint

1. **Endpoint URL**: Digite a URL do seu webhook
   ```
   https://seu-dominio.manus.space/api/stripe/webhook
   ```
   
   **Importante**: Substitua `seu-dominio` pelo seu domínio real do Manus.

2. **Versão da API**: Deixe como padrão (versão mais recente do Stripe)

3. **Eventos para Ouvir**: Selecione os seguintes eventos:
   - `checkout.session.completed` - Quando um checkout é concluído
   - `payment_intent.succeeded` - Quando um pagamento é bem-sucedido
   - `payment_intent.payment_failed` - Quando um pagamento falha
   - `charge.refunded` - Quando um reembolso é processado

### 3. Obter o Webhook Secret

Após criar o webhook, o Stripe fornecerá um **Signing Secret**. Este é um código que você precisará adicionar às variáveis de ambiente do seu projeto.

1. Copie o Signing Secret
2. No painel do Manus, vá para **Settings → Secrets**
3. Adicione uma nova secret com:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: Cole o Signing Secret que você copiou

## Testando o Webhook

### Teste no Stripe Dashboard

1. No Stripe Dashboard, vá para **Webhooks**
2. Clique no webhook que você criou
3. Clique em **Send test event**
4. Selecione um tipo de evento (ex: `checkout.session.completed`)
5. Clique em **Send event**

O Stripe enviará um evento de teste para seu webhook. Você verá o resultado em **Events** na página do webhook.

### Verificar Logs

Para verificar se o webhook foi recebido corretamente:

1. No Stripe Dashboard, vá para **Webhooks**
2. Clique no seu webhook
3. Você verá uma lista de eventos enviados com status de entrega (✓ sucesso ou ✗ falha)
4. Clique em um evento para ver detalhes da requisição e resposta

## Como Funciona

Quando um pagamento é concluído:

1. **Convidado completa o checkout** na sua lista de presentes
2. **Stripe processa o pagamento** e gera um evento `checkout.session.completed`
3. **Stripe envia uma requisição POST** para `/api/stripe/webhook` com os dados do evento
4. **Seu servidor valida a assinatura** do webhook para garantir que é genuína
5. **Seu servidor processa o evento** e:
   - Cria uma transação no banco de dados
   - Atualiza o saldo total do casal
   - Registra os detalhes do presente comprado
6. **Seu servidor responde com sucesso** ao Stripe

## Eventos Processados

### `checkout.session.completed`
- **Quando ocorre**: Um cliente completa o checkout e o pagamento é processado
- **O que acontece**: Uma nova transação é criada no banco de dados com status "completed"
- **Dados capturados**: Nome do convidado, email, valor, método de pagamento

### `payment_intent.succeeded`
- **Quando ocorre**: Um pagamento é confirmado como bem-sucedido
- **O que acontece**: A transação é atualizada para status "completed"

### `payment_intent.payment_failed`
- **Quando ocorre**: Um pagamento falha (cartão recusado, etc)
- **O que acontece**: A transação é marcada com status "failed"

### `charge.refunded`
- **Quando ocorre**: Um reembolso é processado
- **O que acontece**: A transação é marcada com status "refunded"

## Segurança

O webhook implementa várias camadas de segurança:

1. **Verificação de Assinatura**: Cada webhook é assinado com o seu `STRIPE_WEBHOOK_SECRET`. O servidor valida esta assinatura antes de processar qualquer evento.

2. **Validação de Eventos de Teste**: Eventos de teste (com ID começando em `evt_test_`) são tratados especialmente para permitir testes sem afetar dados reais.

3. **Idempotência**: Se o mesmo evento for recebido duas vezes, apenas a primeira ocorrência será processada (usando `stripeSessionId` único).

## Troubleshooting

### Webhook não está recebendo eventos

1. **Verifique a URL**: Certifique-se de que a URL do webhook está correta e acessível
2. **Verifique o Signing Secret**: Certifique-se de que `STRIPE_WEBHOOK_SECRET` está configurado corretamente
3. **Verifique os logs**: No Stripe Dashboard, veja se há erros na entrega do evento

### Erro "Webhook signature verification failed"

- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Certifique-se de que não há espaços em branco no início ou fim do secret

### Transações não estão sendo criadas

1. Verifique se o webhook está sendo recebido (veja os logs do Stripe)
2. Verifique se o banco de dados está acessível
3. Verifique se não há erros nos logs do servidor

## Monitoramento

Para monitorar o webhook em tempo real:

1. **Dashboard do Stripe**: Vá para **Webhooks** e clique no seu endpoint
2. **Logs do Servidor**: Verifique os logs da aplicação para mensagens `[Webhook]`
3. **Dashboard do Casal**: Veja o histórico de transações atualizado em tempo real

## Próximos Passos

Após configurar o webhook:

1. **Teste com um pagamento real** (ou use o cartão de teste 4242 4242 4242 4242)
2. **Monitore o dashboard do casal** para confirmar que as transações aparecem
3. **Configure alertas** no Stripe Dashboard para ser notificado de falhas

## Suporte

Se encontrar problemas:

1. Consulte a [documentação oficial do Stripe](https://stripe.com/docs/webhooks)
2. Verifique os logs no Stripe Dashboard
3. Verifique os logs da aplicação no Manus Management UI
