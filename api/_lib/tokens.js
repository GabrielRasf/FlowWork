import { createHash, randomBytes } from 'node:crypto';
import { erro } from './erros.js';

export function criarToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function rejeitarTokenNaUrl(req) {
  if (req.query && req.query.token !== undefined) {
    throw erro(400, 'O token não pode ir na URL');
  }
}

export function lerToken(body) {
  const token = body?.token;
  if (typeof token !== 'string' || token.length < 20 || token.length > 200) {
    throw erro(403, 'Token inválido');
  }
  return token;
}
