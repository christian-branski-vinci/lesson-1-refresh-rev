import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../service/auth.service.ts';



export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  try {
    AuthService.verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}