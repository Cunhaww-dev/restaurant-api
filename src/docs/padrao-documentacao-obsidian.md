**Padrão de documentação para Obsidian**

Este arquivo define o padrão usado nas documentações do projeto `restaurant-api`.

A ideia é manter as anotações com uma ordem clara: explicar o objetivo, mostrar os comandos ou códigos usados e depois explicar o que cada parte faz.

**Regras gerais**

- Escrever em PT-BR.
- Usar arquivos `.md`.
- Usar blocos de código com 4 crases.
- Informar a linguagem do bloco de código, como `bash`, `ts` ou `json`.
- Usar nomes de arquivos em negrito, como **tables-controller.ts**.
- Evitar mais de uma linha vazia entre parágrafos, títulos e blocos.
- Documentar os comandos utilizados no terminal quando eles forem informados.
- Quando houver aviso no terminal, explicar se ele impede ou não a execução.
- Quando houver imagem no Obsidian, usar o formato `![[Pasted image ...png]]`.

**Estrutura recomendada**

Comece explicando o que será criado ou alterado.

Depois, explique para que aquilo serve no projeto.

Em seguida, mostre o comando usado no terminal:

````bash
npm run knex -- migrate:latest
````

Depois, mostre o arquivo criado ou alterado:

````ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('example', (table) => {
    table.increments('id').primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('example');
}
````

Depois do código, explique as partes importantes em texto.

Quando fizer sentido, use uma lista simples:

- `id`: identificador do registro.
- `created_at`: data de criação do registro.
- `updated_at`: data de atualização do registro.

**Fluxo completo no terminal**

Quando o terminal for importante para a aula ou estudo, inclua uma seção chamada **Fluxo completo no terminal**.

Exemplo:

````bash
lucasfabri@Cunhaww:~/projects/studies/restaurant-api$ npm run knex -- migrate:latest

> restaurant-api@1.0.0 knex
> node --import tsx ./node_modules/.bin/knex migrate:latest

Batch 3 run: 1 migrations
````

**Observações**

Quando aparecer um aviso que não impede a execução, documente com uma explicação curta.

Exemplo:

````bash
Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
````

Esse aviso vem da configuração de conexão com o PostgreSQL e não significa que a migration falhou.

**Ordem recomendada para documentar criação de arquivos**

Para recursos com banco de dados, use esta ordem quando ela fizer sentido:

- Migration.
- Seed.
- Types.
- Controller.
- Rota.
- Index de rotas.
- Teste ou comando de validação.

Para recursos que não envolvem banco de dados, use uma ordem mais direta:

- Types, se houver.
- Controller ou service.
- Rota.
- Registro no index de rotas.
- Teste ou comando de validação.

**Cuidados para copiar no Obsidian**

Evite deixar duas ou mais linhas vazias entre seções.

Use apenas uma linha vazia entre parágrafos, blocos de código e títulos.

Isso reduz o retrabalho de apagar linhas em branco depois de copiar a documentação.
