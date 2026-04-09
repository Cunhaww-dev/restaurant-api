import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandlingMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error({
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : null,
  });

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }

  if (error instanceof ZodError) {
    return response.status(422).json({
      error: {
        message: 'Validation Error',
        details: error.issues.map((issue) => ({
          field: issue.path.length ? issue.path.join('.') : 'root',
          message: issue.message,
        })),
      },
    });
  }

  // if (error instanceof ZodError) {
  //   return response.status(422).json({
  //     message: 'Validation Error',
  //     issues: error.format(),
  //   });
  // }

  return response.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
}
