import {
  catalogoExercicios,
  selecionarDestaque,
  selecionarTreinosLivres,
} from './catalogo.js';

function cardTreino(treino) {
  const card = document.createElement('a');
  card.className = 'ficha-vitrine';
  card.href = 'explorar.html?id=' + encodeURIComponent(treino.id);
  const titulo = document.createElement('strong');
  titulo.textContent = treino.titulo || '';
  const descricao = document.createElement('span');
  descricao.textContent = treino.descricao || '';
  card.append(titulo, descricao);
  return card;
}

function cardExercicio(exercicio) {
  const card = document.createElement('a');
  card.className = 'ficha-vitrine';
  card.href = 'explorar.html?aba=exercicios&q=' + encodeURIComponent(exercicio.nome);
  const titulo = document.createElement('strong');
  titulo.textContent = exercicio.nome;
  const meta = [exercicio.grupo, exercicio.equipamento].filter(Boolean).join(' · ');
  if (meta) {
    const detalhe = document.createElement('span');
    detalhe.textContent = meta;
    card.append(titulo, detalhe);
  } else {
    card.append(titulo);
  }
  return card;
}

function preencher(destino, itens, montar, vazio) {
  destino.replaceChildren();
  if (!itens.length) {
    const aviso = document.createElement('p');
    aviso.textContent = vazio;
    destino.appendChild(aviso);
    return;
  }
  itens.forEach((item) => destino.appendChild(montar(item)));
}

async function carregarVitrine() {
  const livres = document.getElementById('vitrine-livres');
  const exercicios = document.getElementById('vitrine-exercicios');
  if (!livres || !exercicios) return;
  try {
    const resposta = await fetch('/api/treinos');
    const dados = await resposta.json();
    const treinos = Array.isArray(dados.treinos) ? dados.treinos : [];
    preencher(livres, selecionarTreinosLivres(treinos), cardTreino, 'Nenhum treino livre encontrado.');
    preencher(
      exercicios,
      selecionarDestaque(catalogoExercicios(treinos)),
      cardExercicio,
      'Nenhum exercício em destaque.',
    );
  } catch {
    preencher(livres, [], cardTreino, 'Nenhum treino livre encontrado.');
    preencher(exercicios, [], cardExercicio, 'Nenhum exercício em destaque.');
  }
}

carregarVitrine();
