function montarVitrine(destino, treinos) {
  destino.replaceChildren();
  if (!treinos.length) {
    const aviso = document.createElement('p');
    aviso.textContent = 'Nenhuma ficha salva ainda.';
    destino.appendChild(aviso);
    return;
  }
  treinos.forEach((treino) => {
    const card = document.createElement('a');
    card.className = 'ficha-vitrine';
    card.href = 'explorar.html?id=' + encodeURIComponent(treino.id);
    const titulo = document.createElement('strong');
    titulo.textContent = treino.titulo || '';
    const descricao = document.createElement('span');
    descricao.textContent = treino.descricao || '';
    card.append(titulo, descricao);
    destino.appendChild(card);
  });
}

async function carregarVitrine() {
  const recentes = document.getElementById('vitrine-recentes');
  const populares = document.getElementById('vitrine-populares');
  if (!recentes || !populares) return;
  try {
    const resposta = await fetch('/api/treinos');
    const dados = await resposta.json();
    const treinos = Array.isArray(dados.treinos) ? dados.treinos : [];
    montarVitrine(recentes, treinos);
    montarVitrine(populares, treinos);
  } catch {
    montarVitrine(recentes, []);
    montarVitrine(populares, []);
  }
}

carregarVitrine();