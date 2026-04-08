import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { ProductInsert, ProductRow } from "@/database/types/product-types";

class ProductController {
  // Listagem ordenada com filtro por nome
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Aqui a ideia é manter a busca simples, mas já validar a query e só filtrar quando vier um nome.
      const querySchema = z.object({
        name: z.string().trim().optional(),
      });

      const { name } = querySchema.parse(request.query);
      const query = knex<ProductRow>("products")
        .select()
        .orderBy("name", "asc");

      if (name) {
        query.whereLike("name", `%${name}%`);
      }

      const products = await query;

      return response.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(5, "Name must be at least 5 characters"),
        price: z.number().gt(0, "Price must be greater than 0"),
      });

      const { name, price } = bodySchema.parse(request.body); // parse lança um erro se a validação falhar

      // tipando o objeto a ser inserido, omitindo os campos que são gerados automaticamente pelo banco de dados (id, created_at, updated_at)
      const productToInsert: ProductInsert = { name, price };
      await knex<ProductRow>("products").insert(productToInsert);

      return response.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
