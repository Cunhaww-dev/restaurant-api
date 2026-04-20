import { NextFunction, Request, Response } from 'express';
import { idParamSchema } from '@/schemas/common/params.schema';
import { createProductSchema } from '@/schemas/product/create-product.schema';
import { queryProductSchema } from '@/schemas/product/query-product.schema';
import { updateProductSchema } from '@/schemas/product/update-product.schema';
import { productService } from '@/services/product-service';

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = queryProductSchema.parse(request.query);
      const products = await productService.listProducts(name);
      return response.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, price } = createProductSchema.parse(request.body);
      const product = await productService.createProduct(name, price);
      return response.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);
      const { name, price } = updateProductSchema.parse(request.body);
      const product = await productService.updateProduct(id, name, price);
      return response.status(200).json({
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);
      const product = await productService.deleteProduct(id);
      return response.status(200).json({
        message: 'Product deleted successfully',
        product,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
