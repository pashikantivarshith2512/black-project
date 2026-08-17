import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export function generateToken(payload: TokenPayload): string {
  const secret: Secret = env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  const secret: Secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as TokenPayload;
}
