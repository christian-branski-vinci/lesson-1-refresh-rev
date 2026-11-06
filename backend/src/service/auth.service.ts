import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db.ts';
import { userFromDBO } from '../types/user.ts';
import { JWT_SECRET } from '../types/auth.ts';
import type { LoginInput, RegisterInput } from '../types/auth.ts';
import type { User } from '../types/user.ts';
import { ConflictError, AuthenticationError } from '../errors/app.error.ts';

const SALT_ROUNDS = 10;

export class AuthService {
  static async register(input: RegisterInput): Promise<User> {
    // Check if user already exists
    const existingUser = await db.orm.public.User.where({ email: input.email }).first();

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash the password. `bcrypt.hash` is deliberately slow — that is the whole
    // point of it. The plain password never leaves this function.
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const userDbo = await db.orm.public.User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    const user =  userFromDBO(userDbo);
    return user;
  }

  static async login(input: LoginInput): Promise<User> {
    const userDbo = await db.orm.public.User.where({ email: input.email }).first();

    if (!userDbo) {
      throw new AuthenticationError('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(input.password, userDbo.passwordHash);

    if (!validPassword){
        throw new AuthenticationError('Invalid email or password');
    }

    return userFromDBO(userDbo);
    // 1. find the user by email
    // 2. no such user -> throw (read the warning below before choosing the message)
    // 3. compare input.password with the stored hash:
    //    await bcrypt.compare(plain, hash) resolves to a boolean
    // 4. no match -> throw, with the SAME message as step 2
    // 5. return userFromDBO(...)
  }

  static verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}