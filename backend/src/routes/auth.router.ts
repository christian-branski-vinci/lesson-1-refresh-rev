import { Router, type Request, type Response } from 'express';
import { authResponseFromUser, parseLoginInput, parseRegisterInput } from '../types/auth.ts';
import type { AuthResponse } from '../types/auth.ts';
import { AuthService } from '../service/auth.service.ts';

const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const input = parseRegisterInput(req.body);
    if (input === false) {
      return res.status(400).json({ error: 'Invalid registration details' });
    }

    const user = await AuthService.register(input);
    const authResponse: AuthResponse = authResponseFromUser(user);
    res.status(201).json(authResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(409).json({ error: message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const input = parseLoginInput(req.body);
    if (input === false) {
      // Deliberately not "that email is not valid": a login endpoint should not
      // explain to a stranger which half of their guess was wrong.
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = await AuthService.login(input);
    const authResponse: AuthResponse = authResponseFromUser(user);
    res.status(200).json(authResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: message });
  }
});

export default authRouter;