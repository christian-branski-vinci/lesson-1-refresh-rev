import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { type User } from './user.ts';

// Same shape as `types/expense.ts`: a schema, the inferred type, and a
// `parseX()` that returns the parsed value or `false`.
export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  // Length is the only password rule that evidence consistently supports.
  // "One uppercase, one symbol" is not.
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

function parseWithSchema<T>(schema: z.ZodType<T>, data: unknown): T | false {
  const result = schema.safeParse(data);
  return result.success ? result.data : false;
}

export function parseRegisterInput(data: unknown): RegisterInput | false {
  return parseWithSchema(registerSchema, data);
}

export function parseLoginInput(data: unknown): LoginInput | false {
  return parseWithSchema(loginSchema, data);
}

/** What we put *inside* a token, and therefore what comes back out of one. */
export interface UserJWT {
  userId: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * The secret every token is signed with — and checked against.
 *
 * It lives here because two different files need it: step 10 signs tokens with
 * it, and the service verifies them with it. Written down once, so the two can
 * never disagree.
 */
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use';

const TOKEN_LIFETIME = '7d';

export function authResponseFromUser(user: User): AuthResponse {
    // The payload is readable by anyone holding the token — it is signed, not
  // hidden. Put in it only what the server needs to recognise the caller again.
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}