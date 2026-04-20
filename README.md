# Restaurant API

API REST para gerenciamento de produtos, mesas, sessões de mesa e pedidos em um restaurante.

Stack: Node.js, Express 5, TypeScript, PostgreSQL, Knex, Zod, Swagger UI.

## Requisitos

- Node.js definido em `.nvmrc` (`lts/krypton`)
- npm
- PostgreSQL acessível por connection string
- nvm recomendado para usar a versão correta do Node.js

## Configuração inicial

```bash
nvm install && nvm use
npm install
cp .env.example .env
```

Configure a variável `DATABASE_URL` no `.env`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

O projeto está configurado para PostgreSQL com SSL (ex: NeonDB). Para banco local sem SSL, ajuste o `knexfile.ts`.

## Banco de dados

```bash
npm run knex -- migrate:latest   # cria as tabelas
npm run knex -- seed:run         # insere produtos e mesas para testes
npm run knex -- migrate:rollback # desfaz a última migration
```

## Rodando o projeto

```bash
npm run dev
```

| Recurso | URL |
|---|---|
| API | `http://localhost:3333` |
| Swagger UI | `http://localhost:3333/swagger` |
| Health check | `GET http://localhost:3333/health/db` |

## Rotas

### Health

```http
GET /health/db
```

### Produtos

```http
GET    /products
GET    /products?name=pizza
POST   /products
PUT    /products/:id
DELETE /products/:id
```

Regras:
- `name` mínimo 5 caracteres, único (case-insensitive)
- `price` maior que zero

### Mesas

```http
GET /tables
```

### Sessões de mesa

```http
GET   /tables-sessions
GET   /tables-sessions?status=open
GET   /tables-sessions?status=closed&limit=10
POST  /tables-sessions
PATCH /tables-sessions/:id
```

Regras:
- Uma mesa só pode ter uma sessão aberta por vez
- Sessão já encerrada não pode ser encerrada novamente
- `status`: `open` ou `closed` — `limit`: máximo 100, padrão 50

### Pedidos

```http
POST /orders
GET  /orders/table-session/:table_session_id
GET  /orders/table-session/:table_session_id/total
```

Regras:
- A sessão de mesa precisa existir e estar aberta
- O produto precisa existir
- `unit_price` é capturado no momento do pedido — mudanças futuras no preço do produto não afetam pedidos já criados

Resposta do total:

```json
{
  "total_amount": "59.80",
  "total_items": "2"
}
```

## Fluxo básico

1. `npm run knex -- migrate:latest && npm run knex -- seed:run`
2. `npm run dev`
3. `GET /health/db` — confirma conexão com banco
4. `GET /tables` — escolhe uma mesa
5. `POST /tables-sessions` — abre sessão para a mesa
6. `GET /products` — lista produtos disponíveis
7. `POST /orders` — registra pedidos
8. `GET /orders/table-session/:id/total` — consulta conta
9. `PATCH /tables-sessions/:id` — encerra sessão

## Estrutura

```text
src/
  server.ts          # Express, Swagger, rotas, middleware de erro
  routes/            # Endpoints e mapeamento para controllers
  controllers/       # Validação HTTP (Zod) + chamada ao service
  services/          # Regras de negócio e AppError
  schemas/           # Schemas Zod por domínio
  database/
    knex.ts          # Instância Knex
    migrations/      # Migrations com timestamp
    seeds/           # Dados iniciais de desenvolvimento
    types/           # Tipos TypeScript das tabelas (*Row, *Insert)
  middlewares/       # Tratamento centralizado de erros
  utils/             # AppError, constantes Swagger
  docs/swagger/      # Documento OpenAPI e paths por domínio
```

## Documentação interativa

Disponível em `http://localhost:3333/swagger` após subir o servidor.

Ao alterar rotas, schemas ou respostas, atualize os arquivos em `src/docs/swagger/paths/`.

## Decisão de arquitetura: sem camada de repositories

O projeto usa a arquitetura **Controllers → Services → Knex** de forma intencional, sem uma camada de repositories entre services e banco.

Repositories fariam sentido se:
- O ORM/query builder pudesse ser trocado (Knex já é a abstração sobre SQL)
- Houvesse uma suite de testes unitários que precisasse mockar o banco
- Os domínios fossem complexos o suficiente para justificar agregados com múltiplas tabelas

Neste projeto, os repositories seriam wrappers finos em torno do Knex sem lógica própria, adicionando arquivos e indireção sem benefício real. As queries PostgreSQL-específicas (`RETURNING *`, `whereRaw`, `COALESCE`) quebrariam de qualquer forma em uma eventual troca de banco. Quando testes forem introduzidos, a camada de repositories pode ser adicionada para viabilizar mocks.

## Próximos passos recomendados

- Adicionar script de `build` para validar compilação TypeScript
- Adicionar script de `test` com cobertura de regras de negócio nos services
- Adicionar script de `lint` para padronizar o código
- Criar ambiente Docker para PostgreSQL local
- Avaliar autenticação e autorização antes de expor rotas administrativas
