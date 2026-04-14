import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { knex } from '@/database/knex';
import { ProductInsert, ProductRow } from '@/database/types/product-types';
import { AppError } from '@/utils/AppError';
import { createProductSchema } from '@/schemas/product/create-product.schema';
import { updateProductSchema } from '@/schemas/product/update-product.schema';
import { idParamSchema } from '@/schemas/common/params.schema';
import { queryProductSchema } from '@/schemas/product/query-product.schema';

class ProductController {
  // Listagem ordenada com filtro por nome
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Aqui a ideia é manter a busca simples, mas já validar a query e só filtrar quando vier um nome.
      const { name } = queryProductSchema.parse(request.query);
      const query = knex<ProductRow>('products')
        .select()
        .orderBy('name', 'asc');

      if (name) {
        query.whereLike('name', `%${name}%`);
      }

      const products = await query;

      return response.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, price } = createProductSchema.parse(request.body); // parse lança um erro se a validação falhar

      const [productExists] = await knex<ProductRow>('products').whereRaw(
        'LOWER(name) = ?',
        [name.toLowerCase()],
      );

      if (productExists) {
        throw new AppError('This product already exists', 400);
      }

      // tipando o objeto a ser inserido, omitindo os campos que são gerados automaticamente pelo banco de dados (id, created_at, updated_at)
      const productToInsert: ProductInsert = { name, price };
      await knex<ProductRow>('products').insert(productToInsert);

      return response.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);
      const { name, price } = updateProductSchema.parse(request.body);

      // Validação para garantir que não exista dois produtos com o mesmo nome
      const [productWithSameName] = await knex<ProductRow>('products')
        .whereRaw('LOWER(name) = ?', [name.toLowerCase()])
        .whereNot('id', id); // "Ignora o meu próprio ID"

      if (productWithSameName) {
        throw new AppError('Another product already uses this name', 400);
      }

      // Atualização do produto no banco de dados usando Knex, retornando os dados atualizados para o cliente
      const [updatedData] = await knex<ProductRow>('products')
        .where({ id })
        .update({ name, price, updated_at: knex.fn.now() })
        .returning('*');

      // Se o produto não for encontrado, retornamos um erro 404 para o cliente, indicando que o recurso solicitado não existe
      if (!updatedData) {
        throw new AppError('Product not found', 404);
      }

      return response.status(200).json({
        message: 'Product updated successfully',
        product: updatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);

      const [deletedData] = await knex<ProductRow>('products')
        .where({ id })
        .delete()
        .returning('*');

      if (!deletedData) {
        throw new AppError('Product not found', 404);
      }

      return response.status(200).json({
        message: 'Product deleted successfully',
        product: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
