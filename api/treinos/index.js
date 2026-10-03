import { getSql } from '../_lib/db.js';
import { criarHandler, erro, json } from '../_lib/erros.js';
import { respostaTreino, respostaTreinoResumo } from '../_lib/treinos.js';
import { lerJson, validarTreino } from '../_lib/validacao.js';

async function listar(_req, res) {
  const sql = getSql();
  const linhas = await sql`
    SELECT
      t.id,
      t.titulo,
      t.descricao,
      t.criado_em,
      e.bloco,
      e.nome AS exercicio_nome,
      e.series_repeticoes,
      e.ordem
    FROM treinos t
    LEFT JOIN exercicios e ON e.treino_id = t.id
    WHERE t.id IN (
      SELECT id
      FROM treinos
      ORDER BY criado_em DESC
      LIMIT 100
    )
    ORDER BY t.criado_em DESC, e.ordem
  `;

  const grupos = new Map();
  for (const linha of linhas) {
    if (!grupos.has(linha.id)) {
      grupos.set(linha.id, { treino: linha, exercicios: [] });
    }
    if (linha.exercicio_nome) {
      grupos.get(linha.id).exercicios.push({
        bloco: linha.bloco,
        nome: linha.exercicio_nome,
        series_repeticoes: linha.series_repeticoes,
      });
    }
  }

  json(res, 200, {
    treinos: [...grupos.values()].map(({ treino, exercicios }) =>
      respostaTreinoResumo(treino, exercicios)
    ),
  });
}

async function criar(req, res) {
  const dados = validarTreino(lerJson(req));
  const itens = [];
  let ordem = 0;
  for (const bloco of dados.treinos) {
    for (const exercicio of bloco.exercicios) {
      itens.push({
        bloco: bloco.nome,
        nome: exercicio.nome,
        series_repeticoes: exercicio.series_repeticoes,
        ordem,
      });
      ordem += 1;
    }
  }

  const sql = getSql();
  const linhas = await sql`
    WITH novo AS (
      INSERT INTO treinos (titulo, descricao)
      VALUES (${dados.titulo}, ${dados.descricao})
      RETURNING id, titulo, descricao, criado_em
    ),
    inseridos AS (
      INSERT INTO exercicios (treino_id, bloco, nome, series_repeticoes, ordem)
      SELECT novo.id, item.bloco, item.nome, item.series_repeticoes, item.ordem
      FROM novo
      CROSS JOIN jsonb_to_recordset(${JSON.stringify(itens)}::jsonb) AS item(
        bloco text,
        nome text,
        series_repeticoes text,
        ordem int
      )
      RETURNING id, bloco, nome, series_repeticoes, ordem
    )
    SELECT
      novo.id,
      novo.titulo,
      novo.descricao,
      novo.criado_em,
      inseridos.id AS exercicio_id,
      inseridos.bloco,
      inseridos.nome AS exercicio_nome,
      inseridos.series_repeticoes,
      inseridos.ordem
    FROM novo
    JOIN inseridos ON true
    ORDER BY inseridos.ordem
  `;

  if (linhas.length === 0) {
    throw erro(500, 'Falha ao processar a solicitação');
  }

  const treino = linhas[0];
  const exercicios = linhas.map((linha) => ({
    id: linha.exercicio_id,
    bloco: linha.bloco,
    nome: linha.exercicio_nome,
    series_repeticoes: linha.series_repeticoes,
    ordem: linha.ordem,
  }));

  json(res, 201, respostaTreino(treino, exercicios, []));
}

export default criarHandler({
  GET: listar,
  POST: criar,
});
