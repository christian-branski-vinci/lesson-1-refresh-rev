import type { UserJWT } from './auth.ts';

export interface GraphQLContext {
  userJWT?: UserJWT;
}