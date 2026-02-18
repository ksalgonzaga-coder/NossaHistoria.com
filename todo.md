# Wedding Registry - TODO

## Fase 1: Banco de Dados e Autenticação
- [x] Definir schema de tabelas (produtos, fotos, posts, transações)
- [x] Implementar autenticação de administrador
- [x] Criar procedures tRPC para autenticação

## Fase 2: Homepage e Carrossel
- [x] Design da homepage elegante e responsivo
- [x] Implementar carrossel de fotos do casal
- [x] Navegação responsiva (mobile-first)
- [x] Informações do casal e data do casamento

## Fase 3: Catálogo de Produtos
- [x] Página de produtos com grid responsivo
- [x] Detalhes do produto (modal ou página)
- [x] Filtros e busca de produtos
- [x] Integração com banco de dados

## Fase 4: Mural de Posts
- [x] Página do mural de posts
- [x] Upload de fotos para posts
- [x] Formulário de mensagens
- [x] Listagem de posts com paginação

## Fase 5: Painel Administrativo
- [x] Dashboard administrativo
- [x] CRUD de produtos (adicionar, editar, excluir)
- [x] CRUD de fotos do carrossel
- [x] Gerenciamento de posts (moderar/excluir)
- [x] Configurações do casamento

## Fase 6: Integração Stripe
- [x] Configurar Stripe API
- [x] Implementar checkout
- [x] Página de sucesso de pagamento
- [x] Página de cancelamento de pagamento
- [x] Redirecionamento seguro para Stripe

## Fase 7: Testes e Otimização
- [x] Testes unitários com Vitest (11 testes passando)
- [x] Responsividade mobile
- [x] Design elegante e moderno
- [x] Navegação intuitiva

## Fase 8: Entrega
- [x] Criar checkpoint final
- [x] Documentação de uso
- [x] Entregar ao usuário


## Correções Solicitadas

- [x] Redirecionamento automático para pagamento ao selecionar presente
- [x] Nova aba "Contribuir com Valor Livre"
- [x] Múltiplas opções de pagamento (cartão débito/crédito + PIX)
- [x] Guia de configuração de pagamentos
- [x] Mensagem do casal na homepage
- [x] Compactar layout (exceto fotos)
- [x] Footer com redes sociais (Instagram, WhatsApp, Email)
- [x] Nova aba "Galeria de Eventos" com download, likes e comentários
- [x] Schema de banco de dados para galeria de eventos
- [x] Testes unitários para novas funcionalidades


## Novas Funcionalidades - Upload S3 e Autenticação Admin

- [x] Sistema de autenticação de administrador com login/senha
- [x] Funcionalidade de upload de imagens para S3
- [x] Página de login de administrador
- [x] Testes para autenticação
- [ ] Integração de upload no painel de produtos
- [ ] Integração de upload no painel de galeria
- [ ] Proteção de rotas administrativas


## Dashboard do Casal

- [x] Procedures tRPC para dashboard
- [x] Página de dashboard com saldo total
- [x] Histórico de contribuições
- [x] Gráficos e estatísticas
- [x] Seção de dados bancários
- [x] Proteção de acesso (apenas casal)
- [x] Testes para dashboard


## Webhook do Stripe

- [x] Endpoint do webhook com verificação de assinatura
- [x] Processamento de eventos de pagamento
- [x] Atualização de transações
- [x] Atualização de saldo do casal
- [x] Testes do webhook
- [x] Documentação de configuração


## Correções de Navegação e UX

- [x] Implementar navegação com 5 abas principais
- [x] Adicionar botões de navegação na página inicial
- [x] Proteger área de admin com login obrigatório
- [x] Redesenhar footer com redes sociais em coluna vertical
- [x] Permitir múltiplas opções por rede social (Instagram, WhatsApp, Email)
- [ ] Testar navegação e proteção de rotas


## Melhorias de Segurança - Autenticação Admin

- [x] Validar credenciais de admin com hash seguro (scrypt)
- [x] Implementar proteção de procedures tRPC com verificação de permissões
- [x] Criar middleware de autenticação para rotas admin
- [x] Implementar hook useAdminAuth para gerenciar sessão
- [x] Adicionar validação robusta na página de login
- [x] Proteger página Admin com verificação de sessão
- [x] Implementar logout seguro
- [x] Testar segurança de todas as operações administrativas
