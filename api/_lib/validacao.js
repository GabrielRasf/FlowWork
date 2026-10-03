import { erro } from './erros.js';

export function lerJson(req) {
  if (req.body == null || req.body === '') return {};
  if (typeof req.body === 'string') {
    try {
      return objetoJson(JSON.parse(req.body));
    } catch (falha) {
      if (falha.status) throw falha;
      throw erro(400, 'JSON inválido');
    }
  }
  return objetoJson(req.body);
}

function objetoJson(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    throw erro(400, 'JSON inválido');
  }
  return valor;
}

export function idPositivo(valor) {
  if (typeof valor !== 'string' || !/^[1-9]\d*$/.test(valor)) {
    throw erro(400, 'Identificador inválido');
  }
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero)) {
    throw erro(400, 'Identificador inválido');
  }
  return numero;
}

export function validarTreino(body) {
  const titulo = texto(body.titulo, 1, 200, 'Título');
  const descricao = body.descricao == null || body.descricao === ''
    ? ''
    : texto(body.descricao, 0, 2000, 'Descrição');
  if (!Array.isArray(body.treinos) || body.treinos.length < 1 || body.treinos.length > 6) {
    throw erro(400, 'A ficha precisa ter de 1 a 6 blocos');
  }

  const blocos = [];
  let quantidade = 0;
  for (const bloco of body.treinos) {
    if (!bloco || typeof bloco !== 'object' || Array.isArray(bloco)) {
      throw erro(400, 'Bloco inválido');
    }
    const nome = texto(bloco.nome, 1, 80, 'Nome do bloco');
    if (!Array.isArray(bloco.exercicios) || bloco.exercicios.length < 1) {
      throw erro(400, 'Cada bloco precisa ter ao menos um exercício');
    }
    const exercicios = bloco.exercicios.map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw erro(400, 'Exercício inválido');
      }
      quantidade += 1;
      return {
        nome: texto(item.nome, 1, 100, 'Exercício'),
        series_repeticoes: texto(item.series_repeticoes, 1, 50, 'Séries e repetições'),
      };
    });
    blocos.push({ nome, exercicios });
  }
  if (quantidade > 100) {
    throw erro(400, 'A ficha tem exercícios demais');
  }
  return { titulo, descricao, treinos: blocos };
}

export function validarComentario(body) {
  const treinoId = body.treinoId;
  if (typeof treinoId !== 'number' || !Number.isSafeInteger(treinoId) || treinoId < 1) {
    throw erro(400, 'Treino inválido');
  }
  const autor = body.autor == null || String(body.autor).trim() === ''
    ? 'Visitante'
    : texto(body.autor, 1, 80, 'Autor');
  return {
    treinoId,
    autor,
    texto: texto(body.texto, 1, 500, 'Comentário'),
  };
}

export function validarTextoComentario(body) {
  return texto(body.texto, 1, 500, 'Comentário');
}

function texto(valor, minimo, maximo, campo) {
  if (typeof valor !== 'string') {
    throw erro(400, `${campo} inválido`);
  }
  const limpo = valor.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (limpo.length < minimo || limpo.length > maximo) {
    throw erro(400, `${campo} inválido`);
  }
  return limpo;
}
