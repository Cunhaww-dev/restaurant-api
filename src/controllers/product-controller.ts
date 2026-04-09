import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { ProductInsert, ProductRow } from "@/database/types/product-types";
import { AppError } from "@/utils/AppError";

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

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação dos parâmetros da requisição usando Zod'
      const paramsSchema = z.object({
        id: z.coerce.number().int().positive("ID must be a positive integer"),
      });

      // Validação do corpo da requisição para garantir que os dados estão corretos antes de tentar atualizar o produto
      const bodySchema = z.object({
        name: z.string().trim().min(5, "Name must be at least 5 characters"),
        price: z.number().gt(0, "Price must be greater than 0"),
      });

      const { id } = paramsSchema.parse(request.params);
      const { name, price } = bodySchema.parse(request.body);

      // Atualização do produto no banco de dados usando Knex, retornando os dados atualizados para o cliente
      const [updatedData] = await knex<ProductRow>("products")
        .where({ id })
        .update({ name, price, updated_at: knex.fn.now() })
        .returning("*");

      // Se o produto não for encontrado, retornamos um erro 404 para o cliente, indicando que o recurso solicitado não existe
      if (!updatedData) {
        throw new AppError("Product not found", 404);
      }

      return response.status(200).json({
        message: "Product updated successfully",
        product: updatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number().int().positive("ID must be a positive integer"),
      });

      const { id } = paramsSchema.parse(request.params);

      const [deletedData] = await knex<ProductRow>("products")
        .where({ id })
        .delete()
        .returning("*");

      if (!deletedData) {
        throw new AppError("Product not found", 404);
      }

      return response.status(200).json({
        message: "Product deleted successfully",
        product: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
