# Medidas de Segurança - Wedding Registry

Este documento descreve todas as medidas de segurança implementadas no site de lista de presentes para casamento.

## 1. Autenticação e Autorização

### Admin Login
- **Hash de Senha**: Scrypt com salt aleatório de 16 bytes
- **Algoritmo**: Scrypt com 64 bytes de saída
- **Rate Limiting**: Máximo 5 tentativas de login por 15 minutos por email
- **Proteção**: Senhas nunca são armazenadas em texto plano

### Proteção de Rotas
- Rotas administrativas requerem autenticação via login/senha
- Verificação de permissões em cada operação sensível
- Logout seguro com limpeza de sessão

## 2. Criptografia de Dados

### AES-256-GCM
- **Algoritmo**: AES-256 em modo Galois/Counter Mode (GCM)
- **IV (Initialization Vector)**: Aleatório de 16 bytes para cada criptografia
- **Auth Tag**: Autenticação integrada para detectar tampering
- **Formato**: `iv:encryptedData:authTag` (tudo em hexadecimal)

### Dados Criptografados
- Emails de convidados
- Telefones
- Mensagens pessoais
- Qualquer informação pessoal identificável (PII)

**Dados NÃO Criptografados (por design)**:
- IDs de transações do Stripe
- Metadados públicos
- Informações de configuração do site

## 3. Segurança de Pagamentos

### Stripe Integration
- **Dados de Cartão**: NUNCA armazenados localmente
- **PCI Compliance**: Stripe gerencia toda a conformidade
- **Webhook Verification**: Assinatura HMAC verificada para cada evento
- **IDs Armazenados**: Apenas `stripe_customer_id`, `stripe_session_id`, `stripe_payment_intent_id`

### Transações
- Todas as transações registram apenas IDs do Stripe
- Valores monetários armazenados como inteiros (centavos)
- Histórico de transações imutável

## 4. Proteção contra Ataques

### Rate Limiting
- **Login Admin**: 5 tentativas por 15 minutos
- **Cleanup Automático**: Entradas expiradas removidas a cada 5 minutos
- **Implementação**: Em-memória com suporte para Redis em produção

### Validação de Entrada
- Todos os inputs validados com Zod
- Email validation integrada
- Comprimento mínimo/máximo de senhas (6+ caracteres)
- Sanitização de strings

### HTTPS/TLS
- Comunicação criptografada em trânsito
- Certificados SSL/TLS obrigatórios
- HSTS headers recomendados

## 5. Boas Práticas Implementadas

### Senhas
- Nunca em logs
- Nunca em URLs
- Nunca em cookies sem HttpOnly flag
- Sempre com salt aleatório

### Dados Sensíveis
- Criptografia AES-256 para dados em repouso
- Acesso restrito a dados pessoais
- Logs de acesso para auditoria

### Erros
- Mensagens de erro genéricas para usuários
- Logs detalhados apenas para administradores
- Sem exposição de stack traces ao cliente

## 6. Configuração Recomendada

### Variáveis de Ambiente
```bash
# Chave de criptografia (32 caracteres)
ENCRYPTION_KEY=wedding-registry-encryption-key-32-chars-long!!!

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=seu-secret-aleatorio-aqui
```

### Produção
1. Use um serviço de gerenciamento de chaves (AWS KMS, HashiCorp Vault)
2. Implemente Redis para rate limiting distribuído
3. Configure logs centralizados para auditoria
4. Monitore tentativas de login falhadas
5. Implemente 2FA para admin

## 7. Testes de Segurança

Todos os componentes de segurança têm testes unitários:
- Criptografia/Descriptografia (AES-256-GCM)
- Rate Limiting
- Autenticação de Admin
- Validação de Webhook do Stripe

Execute com: `pnpm test`

## 8. Conformidade

### GDPR
- Dados pessoais criptografados
- Direito ao esquecimento implementável
- Consentimento para armazenamento de dados

### PCI DSS
- Nenhum dado de cartão armazenado
- Conformidade delegada ao Stripe
- Logs de transações auditáveis

## 9. Incidentes de Segurança

Se descobrir uma vulnerabilidade:
1. NÃO publique em redes sociais
2. Envie email para: ksalgonzaga@gmail.com
3. Descreva a vulnerabilidade em detalhes
4. Aguarde resposta dentro de 48 horas

## 10. Atualizações de Segurança

- Revise regularmente as dependências
- Mantenha o Node.js atualizado
- Monitore alertas de segurança do Stripe
- Teste novos patches antes de produção
