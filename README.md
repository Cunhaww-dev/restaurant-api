# Restaurant API

API para gerenciamento de produtos, mesas, sessões de mesa e pedidos em um ambiente de restaurante.

O projeto foi construído com Express, Knex e PostgreSQL. Atualmente a estrutura é direta, focada em entrega rápida e em apoio ao desenvolvimento de um front-end de tablet para pedidos na mesa.

## Começando

Instale as dependências:

```bash
npm install
```

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

A API será iniciada na porta `3333` e exibirá no terminal o link para acessar a documentação interativa do Swagger.

## Documentação da API

Após iniciar o servidor, acesse a documentação completa do Swagger em:

```
http://localhost:3333/docs
```

A documentação inclui todos os endpoints disponíveis com exemplos de requisições e respostas, facilitando a exploração e testes da API.

## Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias e ferramentas:

### Backend

- **Node.js**: Runtime JavaScript para execução do servidor
- **Express.js**: Framework HTTP minimalista para criar a API
- **TypeScript**: Superset de JavaScript com tipagem estática

### Banco de Dados

- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **Knex.js**: Query builder SQL e migration tool
- **Migrations**: Versionamento do schema do banco de dados

### Validação e Tipagem

- **Zod**: Validação de schemas em TypeScript com type inference
- **TypeScript Types**: Tipagem forte dos dados do banco de dados

### Documentação e Testing

- **Swagger UI**: Interface interativa para exploração da API
- **Zod OpenAPI**: Integração entre Zod schemas e especificação OpenAPI 3.0

### Tooling

- **tsx**: Executor de TypeScript sem compilação prévia
- **npm**: Gerenciador de pacotes Node.js

## Endpoints principais

### Verificar conexão com o banco

`GET /health/db`

Resposta:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Produtos

`GET /products`

Retorna a lista de produtos.

`POST /products`

Entrada:

```json
{
  "name": "Pizza calabresa",
  "price": 29.9
}
```

`PUT /products/:id`

Atualiza um produto existente.

`DELETE /products/:id`

Remove um produto.

### Mesas

`GET /tables`

Retorna a lista de mesas cadastradas.

### Sessões de mesa

`GET /tables-sessions`

Lista sessões de mesa. É possível utilizar filtros opcionais de status e limite no controller quando necessário.

`POST /tables-sessions`

Cria uma nova sessão para uma mesa.

`PATCH /tables-sessions/:id`

Atualiza uma sessão de mesa existente.

### Pedidos

`POST /orders`

Cria um pedido associado a uma sessão de mesa. O corpo deve conter `table_session_id`, `product_id` e `quantity`.

Exemplo de entrada:

```json
{
  "table_session_id": 1,
  "product_id": 3,
  "quantity": 2
}
```

`GET /orders/table-session/:table_session_id`

Retorna os pedidos de uma sessão de mesa.

Exemplo de resposta:

```json
{
  "orders": [
    {
      "id": 1,
      "table_session_id": 1,
      "product_id": 3,
      "name": "Pizza calabresa",
      "unit_price": "29.90",
      "quantity": 2,
      "total_price": "59.80",
      "created_at": "2026-04-13T12:00:00.000Z",
      "updated_at": "2026-04-13T12:00:00.000Z"
    }
  ]
}
```

`GET /orders/table-session/:table_session_id/total`

Retorna o total da conta para a sessão de mesa.

## Organização atual do código

A arquitetura do projeto segue uma estrutura camada por tipos de recurso:

```
src/
  server.ts                 # Inicialização da aplicação Express
  routes/                   # Definição de todas as rotas
    index.ts               # Agregação de rotas
    products-routes.ts     # Rotas de produtos
    orders-routes.ts       # Rotas de pedidos
    tables-routes.ts       # Rotas de mesas
    tables-session-routes.ts # Rotas de sessões de mesa
  controllers/              # Lógica de controle das requisições
    product-controller.ts
    orders-controller.ts
    tables-controller.ts
    tables-sessions-controller.ts
  database/                 # Configuração e migrations
    knex.ts               # Instância do Knex
    migrations/           # Versionamento do banco de dados
    seeds/                # Dados iniciais para desenvolvimento
    types/                # Tipos das tabelas do banco
  middlewares/              # Middleware de processamento
    error-handling.ts     # Tratamento centralizado de erros
  schemas/                  # Validação com Zod
    product/
    order/
    tables-sessions/
    common/
  utils/                    # Utilitários gerais
    AppError.ts           # Classe de erro personalizada
    swagger-constants.ts  # Constantes para tipagem do Swagger
  docs/                     # Documentação
    swagger/              # Configuração e paths do Swagger
      paths/              # Definição de endpoints
```

### Responsabilidades atuais por camada

- **Controllers**: Recebem requisições, validam dados, chamam lógica de negócio e retornam respostas
- **Routes**: Definem os endpoints e mapeiam para os controllers
- **Database**: Abstração de acesso aos dados via Knex
- **Middlewares**: Tratamento de erros e crossing concerns
- **Schemas**: Validação de entrada de dados com Zod

## Arquitetura futura

O projeto evoluirá para uma arquitetura com separação clara de responsabilidades, implementando:

### Camada de Service

A camada de Service conterá toda a lógica de negócio da aplicação. Isso inclui:

- Regras de validação complexas
- Cálculos e transformações de dados
- Orquestração entre diferentes repositórios
- Implementação de casos de uso específicos do domínio

Exemplo:

```typescript
// src/services/orders/create-order.service.ts
export class CreateOrderService {
  async execute(data: CreateOrderDTO): Promise<Order> {
    // Validação de regras de negócio
    // Cálcula valores
    // Chama repositórios conforme necessário
    // Retorna resultado
  }
}
```

### Camada de Repository

A camada de Repository será responsável exclusivamente pelo acesso aos dados:

- Operações CRUD (Create, Read, Update, Delete)
- Queries complexas ao banco de dados
- Abstração do Knex
- Nenhuma lógica de negócio

Exemplo:

```typescript
// src/repositories/products/products.repository.ts
export class ProductsRepository {
  async findAll(): Promise<Product[]> {}
  async findById(id: number): Promise<Product | null> {}
  async create(data: CreateProductDTO): Promise<Product> {}
  async update(id: number, data: UpdateProductDTO): Promise<Product> {}
  async delete(id: number): Promise<void> {}
}
```

### Benefícios da refatoração

- **Responsabilidade única**: Cada arquivo tem uma única razão para mudar
- **Testabilidade**: Services podem ser testadas independentemente de Controllers
- **Reutilização**: Services podem ser usadas por múltiplos Controllers
- **Manutenção**: Código mais organizado e fácil de entender
- **Escalabilidade**: Estrutura preparada para crescimento do projeto

## Notas de evolução

O projeto está em evolução ativa e está alinhado com os seguintes objetivos:

### Curto prazo

- Implementação completa da separação em camadas (Service e Repository)
- Testes unitários para Services
- Testes de integração para endpoints

### Médio prazo

- Rota para clientes (tablet na mesa)
  - Permite que clientes façam pedidos diretamente
  - Consulta de conta em tempo real
  - Solicitação de garçom

### Longo prazo

- Implementação de sistema de autenticação e autorização
- Integração com sistema de pagamento
- Relatórios e analytics
- Cache distribuído
- Mensageria assíncrona para notificações

## Observações

A versão atual do projeto é funcional e pronta para desenvolvimento. A arquitetura foi inicialmente simplificada para permitir entrega rápida, mas já contempla a evolução para uma estrutura mais robusta e escalável com a implementação das camadas de Service e Repository.
