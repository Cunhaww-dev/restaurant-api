import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';

export function errorHandlingMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: 'Internal Server Error',
  });
}
