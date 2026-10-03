import { neon } from '@neondatabase/serverless';
import { erro } from './erros.js';

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw erro(500, 'Banco de dados não configurado');
  }
  return neon(url);
}
