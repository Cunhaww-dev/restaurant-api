# Restaurant API

API REST para gerenciamento de produtos, mesas, sessões de mesa e pedidos em um restaurante.

O projeto usa Node.js, Express, TypeScript, PostgreSQL, Knex, Zod e Swagger.

## Requisitos

- Node.js definido em `.nvmrc`
- npm
- PostgreSQL acessível por connection string
- nvm recomendado para usar a versão correta do Node.js

## Configuração inicial

Use a versão de Node.js do projeto:

```bash
nvm install
nvm use
```

O arquivo `.nvmrc` aponta para `lts/krypton`.

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Configure a variável `DATABASE_URL` no arquivo `.env`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

O projeto está configurado para PostgreSQL com SSL, como no NeonDB. Caso use um banco local sem SSL, ajuste o `knexfile.ts` conforme necessário.

## Banco de dados

Execute as migrations para criar as tabelas:

```bash
npm run knex -- migrate:latest
```

Execute os seeds para inserir dados iniciais de desenvolvimento:

```bash
npm run knex -- seed:run
```

Os seeds criam produtos e mesas para facilitar testes locais.

Para desfazer a última migration:

```bash
npm run knex -- migrate:rollback
```

## Rodando o projeto

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

Servidor:

```text
http://localhost:3333
```

Documentação Swagger:

```text
http://localhost:3333/docs
```

Health check do banco:

```text
GET http://localhost:3333/health/db
```

Resposta esperada:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor com `tsx watch`.

```bash
npm run knex -- <comando>
```

Executa comandos do Knex usando TypeScript.

Exemplos:

```bash
npm run knex -- migrate:latest
npm run knex -- migrate:rollback
npm run knex -- seed:run
```

No momento, o projeto não possui scripts de teste, build ou lint configurados.

## Rotas principais

### Health

```http
GET /health/db
```

Verifica se a API consegue conectar ao banco de dados.

### Produtos

```http
GET /products
GET /products?name=pizza
POST /products
PUT /products/:id
DELETE /products/:id
```

Criar produto:

```bash
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza calabresa",
    "price": 29.9
  }'
```

Atualizar produto:

```bash
curl -X PUT http://localhost:3333/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza portuguesa",
    "price": 32.9
  }'
```

Regras principais:

- `name` deve ter pelo menos 5 caracteres
- `price` deve ser maior que zero
- nomes de produtos não podem se repetir

### Mesas

```http
GET /tables
```

Lista as mesas cadastradas, ordenadas por número.

### Sessões de mesa

```http
GET /tables-sessions
GET /tables-sessions?status=open
GET /tables-sessions?status=closed&limit=10
POST /tables-sessions
PATCH /tables-sessions/:id
```

Criar sessão para uma mesa:

```bash
curl -X POST http://localhost:3333/tables-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "table_id": 1
  }'
```

Encerrar sessão:

```bash
curl -X PATCH http://localhost:3333/tables-sessions/1
```

Regras principais:

- uma mesa pode ter apenas uma sessão aberta por vez
- sessões encerradas não podem ser encerradas novamente
- `status` aceita `open` ou `closed`
- `limit` deve ser um número positivo e no máximo `100`

### Pedidos

```http
POST /orders
GET /orders/table-session/:table_session_id
GET /orders/table-session/:table_session_id/total
```

Criar pedido:

```bash
curl -X POST http://localhost:3333/orders \
  -H "Content-Type: application/json" \
  -d '{
    "table_session_id": 1,
    "product_id": 3,
    "quantity": 2
  }'
```

Listar pedidos de uma sessão:

```bash
curl http://localhost:3333/orders/table-session/1
```

Consultar total da conta:

```bash
curl http://localhost:3333/orders/table-session/1/total
```

Resposta do total:

```json
{
  "total_amount": "59.80",
  "total_items": "2"
}
```

Regras principais:

- o pedido precisa estar vinculado a uma sessão de mesa existente
- a sessão da mesa precisa estar aberta
- o produto precisa existir
- `quantity` deve ser um número inteiro positivo
- `unit_price` é salvo no pedido para preservar o valor histórico mesmo se o preço do produto mudar depois

## Fluxo básico para testar

1. Execute migrations e seeds.
2. Rode `npm run dev`.
3. Verifique o banco com `GET /health/db`.
4. Liste mesas com `GET /tables`.
5. Crie uma sessão em `POST /tables-sessions`.
6. Liste produtos com `GET /products`.
7. Crie pedidos em `POST /orders`.
8. Consulte a conta em `GET /orders/table-session/:table_session_id/total`.
9. Encerre a sessão com `PATCH /tables-sessions/:id`.

## Estrutura do projeto

```text
src/
  server.ts
  routes/
  controllers/
  schemas/
  database/
    migrations/
    seeds/
    types/
  middlewares/
  utils/
  docs/
    swagger/
      paths/
```

Responsabilidades:

- `server.ts`: inicializa o Express, rotas, Swagger e middleware de erro
- `routes`: define os endpoints da API
- `controllers`: recebe requisições, valida dados, executa regras atuais e responde ao cliente
- `schemas`: valida entradas com Zod
- `database`: configura Knex, migrations, seeds e tipos das tabelas
- `middlewares`: centraliza tratamentos compartilhados, como erros
- `docs/swagger`: define a documentação OpenAPI exibida em `/docs`

## Documentação da API

A documentação interativa fica disponível em:

```text
http://localhost:3333/docs
```

Ela é gerada com Swagger UI e Zod OpenAPI. Sempre que uma rota, schema ou resposta mudar, atualize também os arquivos em `src/docs/swagger/paths`.

## Próximos passos recomendados

- Adicionar script de `build` para validar compilação TypeScript.
- Adicionar script de `test` e cobrir regras de produtos, sessões e pedidos.
- Adicionar script de `lint` ou formatação para padronizar o código.
- Separar regras de negócio em services.
- Separar acesso ao banco em repositories.
- Documentar respostas de erro padronizadas no Swagger.
- Criar ambiente Docker para PostgreSQL local.
- Avaliar autenticação e autorização antes de expor rotas administrativas.

## Observações

Esta API está pronta para desenvolvimento local e testes de integração com um front-end. A estrutura atual é simples de propósito: as rotas chamam controllers, os controllers validam com Zod e acessam o banco via Knex. Conforme o projeto crescer, a separação em services e repositories deve ajudar na manutenção e nos testes.
