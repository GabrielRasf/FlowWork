export function dataIso(valor) {
  if (valor instanceof Date) return valor.toISOString();
  return valor;
}

export function agruparBlocos(exercicios) {
  const blocos = [];
  const indice = new Map();
  for (const item of exercicios) {
    if (!indice.has(item.bloco)) {
      indice.set(item.bloco, blocos.length);
      blocos.push({ nome: item.bloco, exercicios: [] });
    }
    blocos[indice.get(item.bloco)].exercicios.push({
      id: item.id,
      nome: item.nome,
      seriesRepeticoes: item.series_repeticoes,
      ordem: item.ordem,
    });
  }
  return blocos;
}

export function respostaTreino(treino, exercicios, comentarios) {
  return {
    id: treino.id,
    titulo: treino.titulo,
    descricao: treino.descricao,
    criadoEm: dataIso(treino.criado_em),
    treinos: agruparBlocos(exercicios),
    comentarios: comentarios.map((item) => ({
      id: item.id,
      autor: item.autor,
      texto: item.texto,
      criadoEm: dataIso(item.criado_em),
    })),
  };
}

export function respostaTreinoResumo(treino) {
  return {
    id: treino.id,
    titulo: treino.titulo,
    descricao: treino.descricao,
    criadoEm: dataIso(treino.criado_em),
  };
}
