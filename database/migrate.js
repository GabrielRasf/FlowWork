import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raiz, 'database', 'migrations');

function mensagemSegura(falha) {
  const texto = String(falha?.message || falha);
  if (/postgres(ql)?:\/\//i.test(texto) || /DATABASE_URL/i.test(texto)) {
    return 'Falha ao acessar o banco';
  }
  return texto;
}

function carregarEnvLocal() {
  if (process.env.DATABASE_URL) return;
  return readFile(join(raiz, '.env'), 'utf8')
    .then((texto) => {
      for (const linha of texto.split(/\r?\n/)) {
        const limpa = linha.trim();
        if (!limpa || limpa.startsWith('#')) continue;
        const indice = limpa.indexOf('=');
        if (indice === -1) continue;
        const chave = limpa.slice(0, indice).trim();
        if (chave !== 'DATABASE_URL') continue;
        let valor = limpa.slice(indice + 1).trim();
        if (
          (valor.startsWith('"') && valor.endsWith('"')) ||
          (valor.startsWith("'") && valor.endsWith("'"))
        ) {
          valor = valor.slice(1, -1);
        }
        if (valor) process.env.DATABASE_URL = valor;
      }
    })
    .catch((falha) => {
      if (falha.code !== 'ENOENT') throw falha;
    });
}

function comandosSql(conteudo) {
  const semComentarios = conteudo
    .split(/\r?\n/)
    .filter((linha) => !linha.trim().startsWith('--'))
    .join('\n');
  return semComentarios
    .split(';')
    .map((parte) => parte.trim())
    .filter(Boolean);
}

async function migrar() {
  await carregarEnvLocal();
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não configurada');
    process.exitCode = 1;
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const aplicadas = await sql`SELECT id FROM schema_migrations`;
  const feitas = new Set(aplicadas.map((linha) => linha.id));
  const arquivos = (await readdir(pasta))
    .filter((nome) => nome.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  for (const arquivo of arquivos) {
    const id = arquivo.replace(/\.sql$/, '');
    if (feitas.has(id)) continue;
    const comandos = comandosSql(await readFile(join(pasta, arquivo), 'utf8'));
    await sql.transaction((txn) => [
      ...comandos.map((comando) => txn.query(comando)),
      txn`INSERT INTO schema_migrations (id) VALUES (${id})`,
    ]);
    console.log(`Migration aplicada: ${id}`);
  }
}

migrar().catch((falha) => {
  console.error(mensagemSegura(falha));
  process.exitCode = 1;
});
