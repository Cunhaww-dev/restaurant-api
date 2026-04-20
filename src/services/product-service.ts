import { knex } from '@/database/knex';
import { ProductInsert, ProductRow } from '@/database/types/product-types';
import { AppError } from '@/utils/AppError';

export class ProductService {
  async listProducts(name?: string): Promise<ProductRow[]> {
    const query = knex<ProductRow>('products').select().orderBy('name', 'asc');

    if (name) {
      query.whereLike('name', `%${name}%`);
    }

    return query;
  }

  async createProduct(name: string, price: number): Promise<ProductRow> {
    const [productExists] = await knex<ProductRow>('products').whereRaw(
      'LOWER(name) = ?',
      [name.toLowerCase()],
    );

    if (productExists) {
      throw new AppError('This product already exists', 400);
    }

    const productToInsert: ProductInsert = { name, price };
    const [created] = await knex<ProductRow>('products')
      .insert(productToInsert)
      .returning('*');

    return created;
  }

  async updateProduct(
    id: number,
    name: string,
    price: number,
  ): Promise<ProductRow> {
    const [productWithSameName] = await knex<ProductRow>('products')
      .whereRaw('LOWER(name) = ?', [name.toLowerCase()])
      .whereNot('id', id);

    if (productWithSameName) {
      throw new AppError('Another product already uses this name', 400);
    }

    const [updatedData] = await knex<ProductRow>('products')
      .where({ id })
      .update({ name, price, updated_at: knex.fn.now() })
      .returning('*');

    if (!updatedData) {
      throw new AppError('Product not found', 404);
    }

    return updatedData;
  }

  async deleteProduct(id: number): Promise<ProductRow> {
    const [deletedData] = await knex<ProductRow>('products')
      .where({ id })
      .delete()
      .returning('*');

    if (!deletedData) {
      throw new AppError('Product not found', 404);
    }

    return deletedData;
  }
}

export const productService = new ProductService();

