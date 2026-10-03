import { getSql } from '../_lib/db.js';
import { criarHandler, erro, json } from '../_lib/erros.js';
import { dataIso } from '../_lib/treinos.js';
import { criarToken, hashToken, rejeitarTokenNaUrl } from '../_lib/tokens.js';
import { lerJson, validarComentario } from '../_lib/validacao.js';

async function criar(req, res) {
  rejeitarTokenNaUrl(req);
  const dados = validarComentario(lerJson(req));
  const token = criarToken();
  const sql = getSql();

  const treinos = await sql`
    SELECT id
    FROM treinos
    WHERE id = ${dados.treinoId}
  `;
  if (treinos.length === 0) {
    throw erro(404, 'Treino não encontrado');
  }

  const linhas = await sql`
    INSERT INTO comentarios (treino_id, autor, texto, token_hash)
    VALUES (${dados.treinoId}, ${dados.autor}, ${dados.texto}, ${hashToken(token)})
    RETURNING id, treino_id, autor, texto, criado_em
  `;
  const comentario = linhas[0];

  json(res, 201, {
    id: comentario.id,
    treinoId: comentario.treino_id,
    autor: comentario.autor,
    texto: comentario.texto,
    criadoEm: dataIso(comentario.criado_em),
    token,
  });
}

export default criarHandler({
  POST: criar,
});
