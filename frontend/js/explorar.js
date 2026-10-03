import { criarComentario, editarComentario, excluirComentario, listarTreinos, obterTreino } from './api.js';

const CHAVE_TOKENS = 'flow-work-tokens-comentarios';

const MODAL_ID = 'modal-ficha';

function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'block';
}

function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = 'none';
}

window.onclick = function (event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
};

document.getElementById('fechar-ficha').addEventListener('click', () => {
    fecharModal(MODAL_ID);
});

function mensagemParaUsuario(falha, acao = 'carregar as fichas') {
    const texto = String(falha?.message || '');
    if (/postgres(ql)?:\/\//i.test(texto) || /DATABASE_URL/i.test(texto) || /\b(select|insert|update|delete|token_hash)\b/i.test(texto)) {
        return `Não foi possível ${acao}. Tente novamente.`;
    }
    if (falha?.status === 403) return 'Você não pode alterar este comentário.';
    if (!falha?.status || falha.status >= 500 || texto.length > 160) {
        return `Não foi possível ${acao}. Tente novamente.`;
    }
    return texto || `Não foi possível ${acao}. Tente novamente.`;
}

function lerTokens() {
    try {
        const dados = JSON.parse(sessionStorage.getItem(CHAVE_TOKENS) || '{}');
        if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return {};
        return dados;
    } catch {
        return {};
    }
}

function tokenDo(id) {
    const valor = lerTokens()[String(id)];
    return typeof valor === 'string' ? valor : '';
}

function guardarToken(id, token) {
    if (!id || typeof token !== 'string' || !token) return;
    const tokens = lerTokens();
    tokens[String(id)] = token;
    sessionStorage.setItem(CHAVE_TOKENS, JSON.stringify(tokens));
}

function esquecerToken(id) {
    const tokens = lerTokens();
    delete tokens[String(id)];
    sessionStorage.setItem(CHAVE_TOKENS, JSON.stringify(tokens));
}

function mostrarAviso(trilha, texto) {
    trilha.replaceChildren();
    const aviso = document.createElement('p');
    aviso.className = 'lista-vazia';
    aviso.textContent = texto;
    trilha.appendChild(aviso);
}

function criarCard(treino) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.dataset.treinoId = String(treino.id);

    const conteudo = document.createElement('div');
    conteudo.className = 'card-content';
    const titulo = document.createElement('h3');
    titulo.textContent = treino.titulo;
    const resumo = document.createElement('p');
    resumo.textContent = treino.descricao || '';
    conteudo.append(titulo, resumo);
    card.appendChild(conteudo);
    card.addEventListener('click', () => abrirFicha(treino.id));
    return card;
}

function preencherTrilha(trilha, treinos) {
    if (!treinos.length) {
        mostrarAviso(trilha, 'Nenhuma ficha salva ainda.');
        return;
    }
    trilha.replaceChildren();
    for (const treino of treinos) {
        trilha.appendChild(criarCard(treino));
    }
}

function configurarCarrossel(carousel) {
    if (carousel.dataset.pronto === '1') return;
    const track = carousel.querySelector('.carousel-track');
    const prevButton = carousel.querySelector('.arrow-prev');
    const nextButton = carousel.querySelector('.arrow-next');
    if (!track || !prevButton || !nextButton) return;

    const card = track.querySelector('.workout-card');
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const cardMargin = parseFloat(window.getComputedStyle(card).marginRight);
    const scrollAmount = cardWidth + cardMargin;

    prevButton.addEventListener('click', () => {
        track.scrollLeft -= scrollAmount;
    });
    nextButton.addEventListener('click', () => {
        track.scrollLeft += scrollAmount;
    });
    carousel.dataset.pronto = '1';
}

function preencherModal(ficha) {
    document.getElementById('modal-titulo').textContent = ficha.titulo || '';
    document.getElementById('modal-descricao').textContent = ficha.descricao || '';

    const destino = document.getElementById('modal-blocos');
    destino.replaceChildren();
    for (const bloco of ficha.treinos || []) {
        const titulo = document.createElement('h3');
        titulo.textContent = bloco.nome || '';
        const lista = document.createElement('ul');
        for (const exercicio of bloco.exercicios || []) {
            const item = document.createElement('li');
            const ordem = Number.isInteger(exercicio.ordem) ? `${exercicio.ordem}. ` : '';
            item.textContent = `${ordem}${exercicio.nome} — ${exercicio.seriesRepeticoes}`;
            lista.appendChild(item);
        }
        destino.append(titulo, lista);
    }
    prepararComentarios(ficha);
}

let fichaAbertaId = null;

function prepararComentarios(ficha) {
    const id = Number(ficha.id);
    if (fichaAbertaId !== id) {
        document.getElementById('comentario-autor').value = '';
        document.getElementById('comentario-texto').value = '';
        document.getElementById('comentario-aviso').textContent = '';
    }
    fichaAbertaId = Number.isSafeInteger(id) ? id : null;
    renderizarComentarios(Array.isArray(ficha.comentarios) ? ficha.comentarios : []);
}

function renderizarComentarios(comentarios) {
    const lista = document.getElementById('lista-comentarios');
    lista.replaceChildren();
    if (!comentarios.length) {
        const vazio = document.createElement('p');
        vazio.className = 'comentario-texto comentario-vazio';
        vazio.textContent = 'Nenhum comentário ainda.';
        lista.appendChild(vazio);
        return;
    }
    for (const comentario of comentarios) {
        lista.appendChild(criarItemComentario(comentario));
    }
}

function criarItemComentario(comentario) {
    const item = document.createElement('article');
    item.className = 'comentario-item';
    item.dataset.comentarioId = String(comentario.id);

    const autor = document.createElement('strong');
    autor.textContent = comentario.autor || 'Visitante';
    const texto = document.createElement('p');
    texto.className = 'comentario-texto';
    texto.textContent = comentario.texto || '';
    item.append(autor, texto);

    if (!tokenDo(comentario.id)) return item;

    const acoes = document.createElement('div');
    acoes.className = 'comentario-acoes';
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'button-geral button-inicio';
    editar.textContent = 'Editar';
    editar.addEventListener('click', () => iniciarEdicao(item, comentario.id));
    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'button-geral button-sair';
    excluir.textContent = 'Excluir';
    excluir.addEventListener('click', () => excluirComentarioDaFicha(comentario.id, item));
    acoes.append(editar, excluir);
    item.appendChild(acoes);
    return item;
}

function iniciarEdicao(item, id) {
    if (item.querySelector('.comentario-edicao')) return;
    const paragrafo = item.querySelector('.comentario-texto');
    const acoes = item.querySelector('.comentario-acoes');
    const original = paragrafo.textContent;
    const caixa = document.createElement('div');
    caixa.className = 'comentario-edicao';
    const campo = document.createElement('textarea');
    campo.maxLength = 500;
    campo.value = original;
    const salvar = document.createElement('button');
    salvar.type = 'button';
    salvar.className = 'button-geral button-inicio';
    salvar.textContent = 'Salvar';
    const cancelar = document.createElement('button');
    cancelar.type = 'button';
    cancelar.className = 'button-geral button-sair';
    cancelar.textContent = 'Cancelar';
    const aviso = document.createElement('p');
    aviso.className = 'comentario-aviso';
    caixa.append(campo, salvar, cancelar, aviso);
    paragrafo.hidden = true;
    if (acoes) acoes.hidden = true;
    item.appendChild(caixa);

    cancelar.addEventListener('click', () => {
        caixa.remove();
        paragrafo.hidden = false;
        if (acoes) acoes.hidden = false;
    });

    salvar.addEventListener('click', async () => {
        const novo = campo.value.trim();
        if (!novo) {
            aviso.textContent = 'Escreva o comentário.';
            return;
        }
        salvar.disabled = true;
        try {
            const atualizado = await editarComentario(id, novo, tokenDo(id));
            paragrafo.textContent = atualizado.texto || novo;
            caixa.remove();
            paragrafo.hidden = false;
            if (acoes) acoes.hidden = false;
        } catch (falha) {
            aviso.textContent = mensagemParaUsuario(falha, 'atualizar o comentário');
            salvar.disabled = false;
        }
    });
}

async function excluirComentarioDaFicha(id, item) {
    const aviso = document.createElement('p');
    aviso.className = 'comentario-aviso';
    item.appendChild(aviso);
    try {
        await excluirComentario(id, tokenDo(id));
        esquecerToken(id);
        item.remove();
        if (!document.querySelector('#lista-comentarios .comentario-item')) {
            renderizarComentarios([]);
        }
    } catch (falha) {
        aviso.textContent = mensagemParaUsuario(falha, 'excluir o comentário');
    }
}

let enviandoComentario = false;

document.getElementById('form-comentario').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (enviandoComentario || !fichaAbertaId) return;
    const aviso = document.getElementById('comentario-aviso');
    const autor = document.getElementById('comentario-autor').value.trim();
    const texto = document.getElementById('comentario-texto').value.trim();
    if (!texto) {
        aviso.textContent = 'Escreva o comentário.';
        return;
    }
    const botao = document.getElementById('enviar-comentario');
    enviandoComentario = true;
    botao.disabled = true;
    try {
        const criado = await criarComentario({
            treinoId: fichaAbertaId,
            autor,
            texto,
        });
        guardarToken(criado.id, criado.token);
        document.getElementById('comentario-texto').value = '';
        aviso.textContent = '';
        const ficha = await obterTreino(fichaAbertaId);
        renderizarComentarios(Array.isArray(ficha.comentarios) ? ficha.comentarios : []);
    } catch (falha) {
        aviso.textContent = mensagemParaUsuario(falha, 'publicar o comentário');
    } finally {
        enviandoComentario = false;
        botao.disabled = false;
    }
});

let abrindo = false;

async function abrirFicha(id) {
    if (abrindo) return;
    abrindo = true;
    try {
        const ficha = await obterTreino(id);
        preencherModal(ficha);
        abrirModal(MODAL_ID);
    } catch (falha) {
        alert(mensagemParaUsuario(falha));
    } finally {
        abrindo = false;
    }
}

async function carregarListas() {
    const recentes = document.getElementById('lista-recentes');
    const populares = document.getElementById('lista-populares');
    mostrarAviso(recentes, 'Carregando...');
    mostrarAviso(populares, 'Carregando...');
    try {
        const dados = await listarTreinos();
        const treinos = Array.isArray(dados.treinos) ? dados.treinos : [];
        preencherTrilha(recentes, treinos);
        preencherTrilha(populares, treinos);
    } catch (falha) {
        const texto = mensagemParaUsuario(falha);
        mostrarAviso(recentes, texto);
        mostrarAviso(populares, texto);
    }
    document.querySelectorAll('.carousel-container').forEach(configurarCarrossel);
    const idPedido = new URLSearchParams(location.search).get('id');
    if (idPedido && /^[1-9]\d*$/.test(idPedido)) abrirFicha(Number(idPedido));
}

carregarListas();
