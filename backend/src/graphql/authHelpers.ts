import { AuthenticationError } from "../errors/app.error.ts";
import type { UserJWT } from "../types/auth.ts";
import type { GraphQLContext } from "../types/GraphQLContext.ts";


export function requireAuth(context: GraphQLContext): UserJWT {
  if (!context.userJWT) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return context.userJWT;
}

export function requireOwnership(userId: number, resourceOwnerId: number, resourceName = 'resource'): void {
  if (userId !== resourceOwnerId) {
    throw new Error(`You don't have permission to access this ${resourceName}`);
  }
}