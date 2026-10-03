import { getSql } from '../_lib/db.js';
import { criarHandler, erro, json } from '../_lib/erros.js';
import { respostaTreino } from '../_lib/treinos.js';
import { idPositivo } from '../_lib/validacao.js';

async function obter(req, res) {
  const id = idPositivo(req.query.id);
  const sql = getSql();
  const treinos = await sql`
    SELECT id, titulo, descricao, criado_em
    FROM treinos
    WHERE id = ${id}
  `;
  if (treinos.length === 0) {
    throw erro(404, 'Treino não encontrado');
  }

  const exercicios = await sql`
    SELECT id, bloco, nome, series_repeticoes, ordem
    FROM exercicios
    WHERE treino_id = ${id}
    ORDER BY ordem
  `;
  const comentarios = await sql`
    SELECT id, autor, texto, criado_em
    FROM comentarios
    WHERE treino_id = ${id}
    ORDER BY criado_em DESC
  `;

  json(res, 200, respostaTreino(treinos[0], exercicios, comentarios));
}

export default criarHandler({
  GET: obter,
});
