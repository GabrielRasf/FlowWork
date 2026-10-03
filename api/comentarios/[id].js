import { getSql } from '../_lib/db.js';
import { criarHandler, erro, json } from '../_lib/erros.js';
import { dataIso } from '../_lib/treinos.js';
import { hashToken, lerToken, rejeitarTokenNaUrl } from '../_lib/tokens.js';
import { idPositivo, lerJson, validarTextoComentario } from '../_lib/validacao.js';

async function editar(req, res) {
  rejeitarTokenNaUrl(req);
  const id = idPositivo(req.query.id);
  const body = lerJson(req);
  const texto = validarTextoComentario(body);
  const hash = hashToken(lerToken(body));
  const sql = getSql();

  const linhas = await sql`
    UPDATE comentarios
    SET texto = ${texto}
    WHERE id = ${id} AND token_hash = ${hash}
    RETURNING id, treino_id, autor, texto, criado_em
  `;
  if (linhas.length === 0) {
    await distinguirToken(sql, id);
  }

  const comentario = linhas[0];
  json(res, 200, {
    id: comentario.id,
    treinoId: comentario.treino_id,
    autor: comentario.autor,
    texto: comentario.texto,
    criadoEm: dataIso(comentario.criado_em),
  });
}

async function excluir(req, res) {
  rejeitarTokenNaUrl(req);
  const id = idPositivo(req.query.id);
  const hash = hashToken(lerToken(lerJson(req)));
  const sql = getSql();

  const linhas = await sql`
    DELETE FROM comentarios
    WHERE id = ${id} AND token_hash = ${hash}
    RETURNING id
  `;
  if (linhas.length === 0) {
    await distinguirToken(sql, id);
  }

  json(res, 200, { id: linhas[0].id });
}

async function distinguirToken(sql, id) {
  const existe = await sql`
    SELECT id
    FROM comentarios
    WHERE id = ${id}
  `;
  if (existe.length === 0) {
    throw erro(404, 'Comentário não encontrado');
  }
  throw erro(403, 'Token inválido');
}

export default criarHandler({
  PUT: editar,
  DELETE: excluir,
});
