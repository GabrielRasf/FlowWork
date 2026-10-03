async function solicitar(caminho, { method = 'GET', body } = {}) {
  const opcoes = { method };
  if (body !== undefined) {
    opcoes.headers = { 'Content-Type': 'application/json' };
    opcoes.body = JSON.stringify(body);
  }

  const resposta = await fetch(caminho, opcoes);
  let dados = {};
  try {
    dados = await resposta.json();
  } catch {
    dados = {};
  }
  if (!resposta.ok) {
    const falha = new Error(dados.erro || 'Falha na API');
    falha.status = resposta.status;
    throw falha;
  }
  return dados;
}

export function listarTreinos() {
  return solicitar('/api/treinos');
}

export function obterTreino(id) {
  return solicitar(`/api/treinos/${encodeURIComponent(id)}`);
}

export function criarTreino(dados) {
  return solicitar('/api/treinos', { method: 'POST', body: dados });
}

export function criarComentario(dados) {
  return solicitar('/api/comentarios', { method: 'POST', body: dados });
}

export function editarComentario(id, texto, token) {
  return solicitar(`/api/comentarios/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { texto, token },
  });
}

export function excluirComentario(id, token) {
  return solicitar(`/api/comentarios/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    body: { token },
  });
}
