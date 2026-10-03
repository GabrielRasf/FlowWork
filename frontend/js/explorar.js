import { criarComentario, editarComentario, excluirComentario, listarTreinos, obterTreino } from './api.js';
import {
    catalogoExercicios,
    filtrarExercicios,
    filtrarTreinos,
    focoTreino,
    nivelTreino,
    opcoesPresentes,
    ordenarExercicios,
    ordenarTreinos,
    TAMANHO_PAGINA,
    textoContagem,
    treinoEhLivre,
} from './catalogo.js';

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

function preencherModal(ficha) {
    document.getElementById('secao-comentarios').hidden = false;
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

const estado = {
    aba: 'exercicios',
    busca: '',
    grupo: '',
    tipo: '',
    equipamento: '',
    foco: '',
    nivel: '',
    equipamentoTreino: '',
    ordem: 'az',
    visiveis: TAMANHO_PAGINA,
    treinos: [],
    exercicios: [],
};

const ORDEM_EXERCICIOS = [
    ['az', 'A–Z'],
    ['za', 'Z–A'],
    ['grupo', 'Grupo muscular'],
    ['tipo', 'Tipo'],
    ['recentes', 'Mais recentes'],
];

const ORDEM_TREINOS = [
    ['az', 'A–Z'],
    ['za', 'Z–A'],
    ['recentes', 'Mais recentes'],
    ['nivel', 'Nível'],
];

function resultadosAtuais() {
    if (estado.aba === 'treinos') {
        const filtrados = filtrarTreinos(estado.treinos, {
            busca: estado.busca,
            foco: estado.foco,
            nivel: estado.nivel,
            equipamento: estado.equipamentoTreino,
        });
        return ordenarTreinos(filtrados, estado.ordem);
    }
    const filtrados = filtrarExercicios(estado.exercicios, {
        busca: estado.busca,
        grupo: estado.grupo,
        tipo: estado.tipo,
        equipamento: estado.equipamento,
    });
    return ordenarExercicios(filtrados, estado.ordem);
}

function preencherSelect(select, opcoes, valor) {
    const atual = valor;
    select.replaceChildren(new Option('Todos', ''));
    for (const opcao of opcoes) select.append(new Option(opcao, opcao));
    select.value = opcoes.includes(atual) ? atual : '';
}

function preencherOrdem() {
    const select = document.getElementById('filtro-ordem');
    const opcoes = estado.aba === 'treinos' ? ORDEM_TREINOS : ORDEM_EXERCICIOS;
    select.replaceChildren();
    for (const [valor, rotulo] of opcoes) select.append(new Option(rotulo, valor));
    if (!opcoes.some(([valor]) => valor === estado.ordem)) estado.ordem = 'az';
    select.value = estado.ordem;
}

function atualizarAba() {
    const exercicios = estado.aba === 'exercicios';
    document.getElementById('aba-exercicios').setAttribute('aria-selected', String(exercicios));
    document.getElementById('aba-treinos').setAttribute('aria-selected', String(!exercicios));
    document.querySelectorAll('.filtro-exercicio').forEach((campo) => {
        campo.hidden = !exercicios;
    });
    document.querySelectorAll('.filtro-treino').forEach((campo) => {
        campo.hidden = exercicios;
    });
    const rotulo = exercicios ? 'Buscar exercício...' : 'Buscar treino...';
    document.getElementById('rotulo-busca').textContent = rotulo;
    document.getElementById('busca').placeholder = rotulo;
    montarAtalhos();
    preencherOrdem();
}

function montarAtalhos() {
    const destino = document.getElementById('atalhos');
    const itens = estado.aba === 'exercicios'
        ? [
            ['todos', 'Todos os exercícios'],
            ['grupo', 'Por grupo muscular'],
            ['tipo', 'Por tipo'],
            ['sem', 'Sem equipamentos'],
        ]
        : [
            ['todos', 'Todos os treinos'],
            ['livres', 'Treinos livres'],
            ['nivel', 'Por nível'],
        ];
    destino.replaceChildren();
    for (const [id, rotulo] of itens) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'atalho';
        botao.dataset.atalho = id;
        botao.textContent = rotulo;
        botao.setAttribute('aria-pressed', String(atalhoAtivo(id)));
        botao.addEventListener('click', () => aplicarAtalho(id));
        destino.appendChild(botao);
    }
}

function atalhoAtivo(id) {
    if (estado.aba === 'exercicios') {
        if (id === 'sem') return estado.equipamento === 'Sem equipamentos' && estado.ordem === 'az' && !estado.grupo && !estado.tipo && !estado.busca;
        if (id === 'grupo') return estado.ordem === 'grupo' && !estado.equipamento && !estado.grupo && !estado.tipo;
        if (id === 'tipo') return estado.ordem === 'tipo' && !estado.equipamento && !estado.grupo && !estado.tipo;
        return estado.ordem === 'az' && !estado.equipamento && !estado.grupo && !estado.tipo && !estado.busca;
    }
    if (id === 'livres') return estado.equipamentoTreino === 'Sem equipamentos' && estado.ordem === 'az' && !estado.foco && !estado.nivel && !estado.busca;
    if (id === 'nivel') return estado.ordem === 'nivel' && !estado.equipamentoTreino && !estado.foco && !estado.nivel;
    return estado.ordem === 'az' && !estado.equipamentoTreino && !estado.foco && !estado.nivel && !estado.busca;
}

function aplicarAtalho(id) {
    estado.visiveis = TAMANHO_PAGINA;
    if (estado.aba === 'exercicios') {
        estado.grupo = '';
        estado.tipo = '';
        estado.equipamento = '';
        estado.busca = '';
        document.getElementById('busca').value = '';
        estado.ordem = id === 'grupo' ? 'grupo' : id === 'tipo' ? 'tipo' : 'az';
        if (id === 'sem') estado.equipamento = 'Sem equipamentos';
    } else {
        estado.foco = '';
        estado.nivel = '';
        estado.equipamentoTreino = id === 'livres' ? 'Sem equipamentos' : '';
        estado.busca = '';
        document.getElementById('busca').value = '';
        estado.ordem = id === 'nivel' ? 'nivel' : 'az';
    }
    sincronizarControles();
    renderizar();
}

function sincronizarControles() {
    document.getElementById('filtro-grupo').value = estado.grupo;
    document.getElementById('filtro-tipo').value = estado.tipo;
    document.getElementById('filtro-equipamento').value = estado.equipamento;
    document.getElementById('filtro-foco').value = estado.foco;
    document.getElementById('filtro-nivel').value = estado.nivel;
    document.getElementById('filtro-equipamento-treino').value = estado.equipamentoTreino;
    preencherOrdem();
    montarAtalhos();
}

function metaExercicio(item) {
    return [item.grupo, item.tipo, item.equipamento].filter(Boolean).join(' · ');
}

function criarCardExercicio(item) {
    const card = document.createElement('article');
    card.className = 'workout-card';
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'card-content';
    botao.style.width = '100%';
    botao.style.border = 'none';
    botao.style.cursor = 'pointer';
    botao.style.textAlign = 'left';
    botao.style.font = 'inherit';
    const titulo = document.createElement('h3');
    titulo.textContent = item.nome;
    botao.appendChild(titulo);
    const meta = metaExercicio(item);
    if (meta) {
        const linha = document.createElement('p');
        linha.className = 'card-meta';
        linha.textContent = meta;
        botao.appendChild(linha);
    }
    botao.addEventListener('click', () => mostrarExercicio(item));
    card.appendChild(botao);
    return card;
}

function criarCardTreino(treino) {
    const card = document.createElement('article');
    card.className = 'workout-card';
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'card-content';
    botao.style.width = '100%';
    botao.style.border = 'none';
    botao.style.cursor = 'pointer';
    botao.style.textAlign = 'left';
    botao.style.font = 'inherit';
    const titulo = document.createElement('h3');
    titulo.textContent = treino.titulo || '';
    const resumo = document.createElement('p');
    resumo.textContent = treino.descricao || '';
    botao.append(titulo, resumo);
    const etiquetas = [treinoEhLivre(treino) ? 'Sem equipamentos' : '', nivelTreino(treino), focoTreino(treino)].filter(Boolean);
    if (etiquetas.length) {
        const meta = document.createElement('p');
        meta.className = 'card-meta';
        meta.textContent = etiquetas.join(' · ');
        botao.appendChild(meta);
    }
    botao.addEventListener('click', () => abrirFicha(treino.id));
    card.appendChild(botao);
    return card;
}

function mostrarExercicio(item) {
    document.getElementById('secao-comentarios').hidden = true;
    document.getElementById('modal-titulo').textContent = item.nome;
    document.getElementById('modal-descricao').textContent = metaExercicio(item);
    const destino = document.getElementById('modal-blocos');
    destino.replaceChildren();
    const titulo = document.createElement('h3');
    titulo.textContent = 'Fichas com este exercício';
    const lista = document.createElement('div');
    lista.className = 'lista-fichas-exercicio';
    for (const ficha of item.fichas) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.textContent = ficha.titulo;
        botao.addEventListener('click', () => abrirFicha(ficha.id));
        lista.appendChild(botao);
    }
    destino.append(titulo, lista);
    abrirModal(MODAL_ID);
}

function renderizar() {
    const destino = document.getElementById('resultados');
    const contador = document.getElementById('contador');
    const lista = resultadosAtuais();
    const singular = estado.aba === 'treinos' ? 'treino' : 'exercício';
    const plural = estado.aba === 'treinos' ? 'treinos' : 'exercícios';
    contador.textContent = textoContagem(lista.length, singular, plural);
    destino.replaceChildren();
    if (!lista.length) {
        const vazio = document.createElement('p');
        vazio.className = 'lista-vazia';
        vazio.textContent = estado.aba === 'treinos' ? 'Nenhum treino encontrado.' : 'Nenhum exercício encontrado.';
        const limpar = document.createElement('button');
        limpar.type = 'button';
        limpar.className = 'button-geral button-sair';
        limpar.textContent = 'Limpar filtros';
        limpar.addEventListener('click', limparFiltros);
        destino.append(vazio, limpar);
        document.getElementById('carregar-mais').hidden = true;
        return;
    }
    const pagina = lista.slice(0, estado.visiveis);
    for (const item of pagina) {
        destino.appendChild(estado.aba === 'treinos' ? criarCardTreino(item) : criarCardExercicio(item));
    }
    const mais = document.getElementById('carregar-mais');
    mais.hidden = pagina.length >= lista.length;
}

function limparFiltros() {
    estado.busca = '';
    estado.grupo = '';
    estado.tipo = '';
    estado.equipamento = '';
    estado.foco = '';
    estado.nivel = '';
    estado.equipamentoTreino = '';
    estado.ordem = 'az';
    estado.visiveis = TAMANHO_PAGINA;
    document.getElementById('busca').value = '';
    sincronizarControles();
    renderizar();
}

function lerFiltrosDosControles() {
    estado.grupo = document.getElementById('filtro-grupo').value;
    estado.tipo = document.getElementById('filtro-tipo').value;
    estado.equipamento = document.getElementById('filtro-equipamento').value;
    estado.foco = document.getElementById('filtro-foco').value;
    estado.nivel = document.getElementById('filtro-nivel').value;
    estado.equipamentoTreino = document.getElementById('filtro-equipamento-treino').value;
    estado.ordem = document.getElementById('filtro-ordem').value || 'az';
    estado.visiveis = TAMANHO_PAGINA;
    montarAtalhos();
    renderizar();
}

function prepararFiltros() {
    const exerciciosComClasse = estado.exercicios.map((item) => item);
    preencherSelect(document.getElementById('filtro-grupo'), opcoesPresentes(exerciciosComClasse, 'grupo'), estado.grupo);
    preencherSelect(document.getElementById('filtro-tipo'), opcoesPresentes(exerciciosComClasse, 'tipo'), estado.tipo);
    preencherSelect(document.getElementById('filtro-equipamento'), opcoesPresentes(exerciciosComClasse, 'equipamento'), estado.equipamento);
    const fichas = estado.treinos.map((treino) => ({
        foco: focoTreino(treino),
        nivel: nivelTreino(treino),
    }));
    preencherSelect(document.getElementById('filtro-foco'), opcoesPresentes(fichas, 'foco'), estado.foco);
    preencherSelect(document.getElementById('filtro-nivel'), opcoesPresentes(fichas, 'nivel'), estado.nivel);
    if (!['', 'Sem equipamentos', 'Com equipamentos'].includes(estado.equipamentoTreino)) {
        estado.equipamentoTreino = '';
    }
    document.getElementById('filtro-equipamento-treino').value = estado.equipamentoTreino;
}

function alternarAba(aba) {
    estado.aba = aba;
    estado.visiveis = TAMANHO_PAGINA;
    if (aba === 'exercicios' && !ORDEM_EXERCICIOS.some(([valor]) => valor === estado.ordem)) estado.ordem = 'az';
    if (aba === 'treinos' && !ORDEM_TREINOS.some(([valor]) => valor === estado.ordem)) estado.ordem = 'az';
    atualizarAba();
    renderizar();
}

function ligarCatalogo() {
    document.getElementById('aba-exercicios').addEventListener('click', () => alternarAba('exercicios'));
    document.getElementById('aba-treinos').addEventListener('click', () => alternarAba('treinos'));
    document.getElementById('form-busca').addEventListener('submit', (event) => event.preventDefault());
    document.getElementById('busca').addEventListener('input', (event) => {
        estado.busca = event.target.value;
        estado.visiveis = TAMANHO_PAGINA;
        montarAtalhos();
        renderizar();
    });
    document.getElementById('painel-filtros').addEventListener('change', lerFiltrosDosControles);
    document.getElementById('limpar-filtros').addEventListener('click', limparFiltros);
    document.getElementById('carregar-mais').addEventListener('click', () => {
        estado.visiveis += TAMANHO_PAGINA;
        renderizar();
    });
    const painel = document.getElementById('painel-filtros');
    const abrir = document.getElementById('abrir-filtros');
    abrir.addEventListener('click', () => {
        const aberto = painel.classList.toggle('aberto');
        abrir.setAttribute('aria-expanded', String(aberto));
        abrir.textContent = aberto ? 'Fechar filtros' : 'Filtrar';
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && painel.classList.contains('aberto')) {
            painel.classList.remove('aberto');
            abrir.setAttribute('aria-expanded', 'false');
            abrir.textContent = 'Filtrar';
            abrir.focus();
        }
    });
}

async function carregarCatalogo() {
    const destino = document.getElementById('resultados');
    const contador = document.getElementById('contador');
    contador.textContent = 'Carregando...';
    destino.replaceChildren();
    const parametros = new URLSearchParams(location.search);
    if (parametros.get('aba') === 'treinos') estado.aba = 'treinos';
    if (parametros.get('livre') === '1') estado.equipamentoTreino = 'Sem equipamentos';
    if (parametros.get('q')) {
        estado.busca = parametros.get('q');
        estado.aba = 'exercicios';
    }
    document.getElementById('busca').value = estado.busca;
    try {
        const dados = await listarTreinos();
        estado.treinos = Array.isArray(dados.treinos) ? dados.treinos : [];
        estado.exercicios = catalogoExercicios(estado.treinos);
        prepararFiltros();
        atualizarAba();
        renderizar();
    } catch (falha) {
        contador.textContent = mensagemParaUsuario(falha);
    }
    const idPedido = parametros.get('id');
    if (idPedido && /^[1-9]\d*$/.test(idPedido) && !parametros.get('q')) abrirFicha(Number(idPedido));
}

ligarCatalogo();
carregarCatalogo();
