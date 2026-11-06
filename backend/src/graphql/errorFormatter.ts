import { GraphQLError } from 'graphql';
import { AppError } from '../errors/app.error.ts';

export function maskError(error: unknown, message: string, isDev?: boolean): Error {
  const originalError = (error as any)?.originalError ?? error;

  if (originalError instanceof AppError) {
    return new GraphQLError(originalError.message, {
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
      },
    });
  }

  if (isDev) {
    return error as Error;
  }

  return new Error(message);
}