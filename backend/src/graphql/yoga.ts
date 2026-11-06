import { createYoga, maskError } from 'graphql-yoga';

import { schema } from './schema.ts';
import { AuthService } from '../service/auth.service.ts';
import type { GraphQLContext } from '../types/GraphQLContext.ts';

function graphQLContextFromRequest(request: Request): GraphQLContext {
  // Yoga speaks the Web `Request` API, so headers are read with
  // `request.headers.get(...)` — not Node's `req.headers` object.
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

  if (!token) {
    return {};
  }

  try {
    const jwt = AuthService.verifyToken(token);
    return { userJWT:  jwt };
  } catch {
    // A bad or expired token is not a crash. The request carries on as
    // anonymous, and the resolvers refuse it a moment later.
    return {};
  }
}

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: false,
  maskedErrors: {
    maskError,
    isDev: process.env.NODE_ENV !== 'production',
  },
  context: ({ request }): GraphQLContext => graphQLContextFromRequest(request),
});