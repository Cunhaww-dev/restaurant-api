# Restaurant API

API simples para gerenciamento de produtos, mesas, sessões de mesa e pedidos em um ambiente de restaurante.

O projeto foi construído com Express, Knex e PostgreSQL. Atualmente a estrutura é direta, focada em entrega rápida e em apoio ao desenvolvimento de um front-end de tablet para pedidos na mesa.

## Como usar

Instale as dependências:

```bash
npm install
```

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

A API será iniciada na porta `3333`.

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

- `src/server.ts`: entrada da aplicação.
- `src/routes`: definição das rotas e associação com os controllers.
- `src/controllers`: lógica de controle das requisições.
- `src/database`: configuração do Knex, migrations e seeds.
- `src/middlewares`: tratamento centralizado de erros.
- `src/utils/AppError.ts`: classe de erro personalizada.

## Notas de evolução

O projeto está em evolução. Futuramente será adotada uma separação em camadas mais clara, com:

- `service` para regras de negócio;
- `repository` para acesso ao banco;
- `schemas` para validação de entrada e resposta.

Também está planejada a adição de uma rota voltada para clientes, para uso em tablet na mesa. Essa rota permitirá que os clientes façam pedidos diretamente e consultem a conta separadamente.

O Swagger também será adicionado para facilitar a leitura e a navegação da documentação da API.

## Observações

A versão atual do projeto é um protótipo funcional. As melhorias de arquitetura e a documentação via Swagger estão previstas como próximos passos.
