import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();

  await knex("products").insert([
    { name: "Nhoque quatro queijos", price: 20.99 },
    { name: "Lasanha à bolonhesa", price: 24.99 },
    { name: "Pizza calabresa", price: 29.9 },
    { name: "Pizza marguerita", price: 27.5 },
    { name: "Espaguete ao molho branco", price: 22.0 },
    { name: "Macarrão alho e óleo", price: 18.5 },
    { name: "Ravioli de carne", price: 26.9 },
    { name: "Ravioli de queijo", price: 25.9 },
    { name: "Nhoque ao sugo", price: 19.9 },
    { name: "Nhoque bolonhesa", price: 21.9 },
    { name: "Risoto de frango", price: 28.5 },
    { name: "Risoto de camarão", price: 34.9 },
    { name: "Frango grelhado", price: 23.0 },
    { name: "Filé mignon ao molho madeira", price: 39.9 },
    { name: "Hambúrguer artesanal", price: 19.9 },
    { name: "Cheeseburger duplo", price: 22.9 },
    { name: "Batata frita média", price: 12.5 },
    { name: "Batata frita com cheddar", price: 15.9 },
    { name: "Salada Caesar", price: 17.9 },
    { name: "Panqueca de carne", price: 20.5 },
    { name: "Panqueca de frango", price: 19.5 },
  ]);
}
