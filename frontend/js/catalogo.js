export const LIMITE_TREINOS_HOME = 3;
export const LIMITE_EXERCICIOS_HOME = 4;
export const TAMANHO_PAGINA = 12;

const SEM_EQUIPAMENTOS = 'Sem equipamentos';

const CLASSIFICACAO = {
  'abdominal': { grupo: 'Abdômen', tipo: 'Core', equipamento: SEM_EQUIPAMENTOS },
  'abdominal infra': { grupo: 'Abdômen', tipo: 'Core', equipamento: SEM_EQUIPAMENTOS },
  'abdominal obliquo': { grupo: 'Abdômen', tipo: 'Core', equipamento: SEM_EQUIPAMENTOS },
  'abducao de quadril': { grupo: 'Glúteos', tipo: 'Isolador', equipamento: '' },
  'afundo': { grupo: 'Quadríceps', tipo: 'Composto', equipamento: '' },
  'agachamento': { grupo: 'Quadríceps', tipo: 'Composto', equipamento: 'Barra' },
  'agachamento com salto': { grupo: 'Quadríceps', tipo: 'Cardio', equipamento: SEM_EQUIPAMENTOS },
  'agachamento livre': { grupo: 'Quadríceps', tipo: 'Composto', equipamento: '' },
  'agachamento sumo': { grupo: 'Glúteos', tipo: 'Composto', equipamento: '' },
  'alongamento de flexor': { grupo: '', tipo: 'Mobilidade', equipamento: SEM_EQUIPAMENTOS },
  'barra fixa': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Barra' },
  'burpee': { grupo: 'Corpo inteiro', tipo: 'Cardio', equipamento: SEM_EQUIPAMENTOS },
  'cadeira extensora': { grupo: 'Quadríceps', tipo: 'Isolador', equipamento: 'Máquina' },
  'cadeira flexora': { grupo: 'Posteriores de coxa', tipo: 'Isolador', equipamento: 'Máquina' },
  'corrida estacionaria': { grupo: 'Corpo inteiro', tipo: 'Cardio', equipamento: SEM_EQUIPAMENTOS },
  'crossover no cabo': { grupo: 'Peito', tipo: 'Isolador', equipamento: 'Cabo' },
  'crucifixo': { grupo: 'Peito', tipo: 'Isolador', equipamento: 'Halteres' },
  'crucifixo inclinado': { grupo: 'Peito', tipo: 'Isolador', equipamento: 'Halteres' },
  'desenvolvimento': { grupo: 'Ombros', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'desenvolvimento com halteres': { grupo: 'Ombros', tipo: 'Composto', equipamento: 'Halteres' },
  'desenvolvimento de ombros': { grupo: 'Ombros', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'elevacao de pernas': { grupo: 'Abdômen', tipo: 'Core', equipamento: '' },
  'elevacao frontal': { grupo: 'Ombros', tipo: 'Isolador', equipamento: 'Halteres' },
  'elevacao lateral': { grupo: 'Ombros', tipo: 'Isolador', equipamento: 'Halteres' },
  'elevacao pelvica': { grupo: 'Glúteos', tipo: 'Composto', equipamento: SEM_EQUIPAMENTOS },
  'encolhimento': { grupo: '', tipo: 'Isolador', equipamento: '', exigeEquipamento: true },
  'face pull': { grupo: 'Ombros', tipo: 'Isolador', equipamento: 'Cabo' },
  'flexao de braco': { grupo: 'Peito', tipo: 'Composto', equipamento: SEM_EQUIPAMENTOS },
  'gato-camelo': { grupo: '', tipo: 'Mobilidade', equipamento: SEM_EQUIPAMENTOS },
  'hip thrust': { grupo: 'Glúteos', tipo: 'Composto', equipamento: '' },
  'leg press': { grupo: 'Quadríceps', tipo: 'Composto', equipamento: 'Máquina' },
  'mesa flexora': { grupo: 'Posteriores de coxa', tipo: 'Isolador', equipamento: 'Máquina' },
  'mergulho em paralelas': { grupo: 'Peito', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'mergulho no banco': { grupo: 'Tríceps', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'mountain climber': { grupo: 'Corpo inteiro', tipo: 'Cardio', equipamento: SEM_EQUIPAMENTOS },
  'panturrilha em pe': { grupo: 'Panturrilhas', tipo: 'Isolador', equipamento: '' },
  'panturrilha sentado': { grupo: 'Panturrilhas', tipo: 'Isolador', equipamento: 'Máquina' },
  'polichinelo': { grupo: 'Corpo inteiro', tipo: 'Cardio', equipamento: SEM_EQUIPAMENTOS },
  'ponte de gluteo': { grupo: 'Glúteos', tipo: 'Isolador', equipamento: SEM_EQUIPAMENTOS },
  'prancha': { grupo: 'Abdômen', tipo: 'Core', equipamento: SEM_EQUIPAMENTOS },
  'prancha lateral': { grupo: 'Abdômen', tipo: 'Core', equipamento: SEM_EQUIPAMENTOS },
  'pulldown': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Máquina' },
  'puxada frontal': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Máquina' },
  'remada': { grupo: 'Costas', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'remada alta': { grupo: 'Ombros', tipo: 'Composto', equipamento: '', exigeEquipamento: true },
  'remada baixa': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Cabo' },
  'remada curvada': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Barra' },
  'remada unilateral': { grupo: 'Costas', tipo: 'Composto', equipamento: 'Halteres' },
  'rosca concentrada': { grupo: 'Bíceps', tipo: 'Isolador', equipamento: 'Halteres' },
  'rosca direta': { grupo: 'Bíceps', tipo: 'Isolador', equipamento: '', exigeEquipamento: true },
  'rosca martelo': { grupo: 'Bíceps', tipo: 'Isolador', equipamento: 'Halteres' },
  'rosca scott': { grupo: 'Bíceps', tipo: 'Isolador', equipamento: '', exigeEquipamento: true },
  'rotacao de quadril': { grupo: '', tipo: 'Mobilidade', equipamento: SEM_EQUIPAMENTOS },
  'rotacao toracica': { grupo: '', tipo: 'Mobilidade', equipamento: SEM_EQUIPAMENTOS },
  'stiff': { grupo: 'Posteriores de coxa', tipo: 'Composto', equipamento: 'Barra' },
  'supino declinado': { grupo: 'Peito', tipo: 'Composto', equipamento: 'Barra' },
  'supino inclinado': { grupo: 'Peito', tipo: 'Composto', equipamento: 'Barra' },
  'supino reto': { grupo: 'Peito', tipo: 'Composto', equipamento: 'Barra' },
  'triceps frances': { grupo: 'Tríceps', tipo: 'Isolador', equipamento: '', exigeEquipamento: true },
  'triceps pulley': { grupo: 'Tríceps', tipo: 'Isolador', equipamento: 'Cabo' },
  'triceps testa': { grupo: 'Tríceps', tipo: 'Isolador', equipamento: '', exigeEquipamento: true },
};

const FOCO_TITULO = {
  'peito': 'Peito',
  'costas': 'Costas',
  'ombros': 'Ombros',
  'bracos': 'Braços',
  'pernas': 'Pernas',
  'pernas e posterior': 'Pernas',
  'gluteos': 'Glúteos',
  'abdomen': 'Abdômen',
  'cardio': 'Cardio',
  'full body': 'Corpo inteiro',
  'forca de corpo inteiro': 'Corpo inteiro',
};

const ORDEM_NIVEL = { 'Iniciante': 0, 'Intermediário': 1, 'Avançado': 2 };

export function normalizar(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function classificarExercicio(nome) {
  const encontrado = CLASSIFICACAO[normalizar(nome)];
  if (!encontrado) return { grupo: '', tipo: '', equipamento: '' };
  return {
    grupo: encontrado.grupo || '',
    tipo: encontrado.tipo || '',
    equipamento: encontrado.equipamento || '',
  };
}

export function treinoEhLivre(treino) {
  const exercicios = Array.isArray(treino?.exercicios) ? treino.exercicios : [];
  if (!exercicios.length) return false;
  return exercicios.every((item) => classificarExercicio(item.nome).equipamento === SEM_EQUIPAMENTOS);
}

export function nivelTreino(treino) {
  const titulo = normalizar(treino?.titulo);
  const descricao = normalizar(treino?.descricao);
  if (titulo === 'iniciantes') return 'Iniciante';
  if (titulo === 'intermediario') return 'Intermediário';
  if (titulo === 'avancado') return 'Avançado';
  if (descricao.includes('nivel intermediario')) return 'Intermediário';
  if (descricao.includes('nivel iniciante')) return 'Iniciante';
  if (descricao.includes('nivel avancado')) return 'Avançado';
  return '';
}

export function focoTreino(treino) {
  return FOCO_TITULO[normalizar(treino?.titulo)] || '';
}

export function catalogoExercicios(treinos) {
  const mapa = new Map();
  const fichas = [...(treinos || [])].sort((a, b) => String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')));
  for (const treino of fichas) {
    for (const item of treino.exercicios || []) {
      const chave = normalizar(item.nome);
      if (!chave) continue;
      if (!mapa.has(chave)) {
        const classe = classificarExercicio(item.nome);
        mapa.set(chave, {
          nome: item.nome,
          grupo: classe.grupo,
          tipo: classe.tipo,
          equipamento: classe.equipamento,
          criadoEm: treino.criadoEm || '',
          fichas: [],
        });
      }
      const atual = mapa.get(chave);
      if (String(treino.criadoEm || '') > String(atual.criadoEm || '')) atual.criadoEm = treino.criadoEm || '';
      if (!atual.fichas.some((ficha) => ficha.id === treino.id)) {
        atual.fichas.push({
          id: treino.id,
          titulo: treino.titulo || '',
          criadoEm: treino.criadoEm || '',
        });
      }
    }
  }
  return [...mapa.values()];
}

export function selecionarTreinosLivres(treinos, limite = LIMITE_TREINOS_HOME) {
  return (treinos || [])
    .filter(treinoEhLivre)
    .sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt'))
    .slice(0, limite);
}

export function selecionarDestaque(exercicios, limite = LIMITE_EXERCICIOS_HOME) {
  const ordenados = (exercicios || [])
    .filter((item) => item.equipamento === SEM_EQUIPAMENTOS)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
  const escolhidos = [];
  const vistos = new Set();
  for (const item of ordenados) {
    if (escolhidos.length >= limite) break;
    const chave = item.grupo || item.tipo || item.nome;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    escolhidos.push(item);
  }
  for (const item of ordenados) {
    if (escolhidos.length >= limite) break;
    if (!escolhidos.includes(item)) escolhidos.push(item);
  }
  return escolhidos;
}

function incluiBusca(texto, busca) {
  if (!busca) return true;
  return normalizar(texto).includes(busca);
}

export function filtrarExercicios(exercicios, criterios) {
  const busca = normalizar(criterios?.busca);
  return (exercicios || []).filter((item) => {
    const texto = [item.nome, item.grupo, item.tipo, item.equipamento].join(' ');
    if (!incluiBusca(texto, busca)) return false;
    if (criterios.grupo && item.grupo !== criterios.grupo) return false;
    if (criterios.tipo && item.tipo !== criterios.tipo) return false;
    if (criterios.equipamento && item.equipamento !== criterios.equipamento) return false;
    return true;
  });
}

export function filtrarTreinos(treinos, criterios) {
  const busca = normalizar(criterios?.busca);
  return (treinos || []).filter((treino) => {
    const nomes = (treino.exercicios || []).map((item) => item.nome).join(' ');
    const texto = [treino.titulo, treino.descricao, nomes, focoTreino(treino), nivelTreino(treino)].join(' ');
    if (!incluiBusca(texto, busca)) return false;
    if (criterios.foco && focoTreino(treino) !== criterios.foco) return false;
    if (criterios.nivel && nivelTreino(treino) !== criterios.nivel) return false;
    if (criterios.equipamento === SEM_EQUIPAMENTOS && !treinoEhLivre(treino)) return false;
    if (criterios.equipamento === 'Com equipamentos' && (treinoEhLivre(treino) || !treinoUsaEquipamento(treino))) return false;
    return true;
  });
}

function exigeEquipamento(nome) {
  const encontrado = CLASSIFICACAO[normalizar(nome)];
  if (!encontrado) return false;
  if (encontrado.equipamento === SEM_EQUIPAMENTOS) return false;
  if (encontrado.equipamento) return true;
  return Boolean(encontrado.exigeEquipamento);
}

function treinoUsaEquipamento(treino) {
  return (treino.exercicios || []).some((item) => exigeEquipamento(item.nome));
}

function compararTexto(a, b) {
  return String(a || '').localeCompare(String(b || ''), 'pt', { sensitivity: 'base' });
}

function compararOpcional(a, b, desempateA, desempateB) {
  if (!a && !b) return compararTexto(desempateA, desempateB);
  if (!a) return 1;
  if (!b) return -1;
  return compararTexto(a, b) || compararTexto(desempateA, desempateB);
}

export function ordenarExercicios(exercicios, ordem) {
  const lista = [...(exercicios || [])];
  lista.sort((a, b) => {
    if (ordem === 'za') return compararTexto(b.nome, a.nome);
    if (ordem === 'grupo') return compararOpcional(a.grupo, b.grupo, a.nome, b.nome);
    if (ordem === 'tipo') return compararOpcional(a.tipo, b.tipo, a.nome, b.nome);
    if (ordem === 'recentes') {
      return String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')) || compararTexto(a.nome, b.nome);
    }
    return compararTexto(a.nome, b.nome);
  });
  return lista;
}

export function ordenarTreinos(treinos, ordem) {
  const lista = [...(treinos || [])];
  lista.sort((a, b) => {
    if (ordem === 'za') return compararTexto(b.titulo, a.titulo);
    if (ordem === 'recentes') {
      return String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')) || compararTexto(a.titulo, b.titulo);
    }
    if (ordem === 'nivel') {
      const nivelA = ORDEM_NIVEL[nivelTreino(a)] ?? 99;
      const nivelB = ORDEM_NIVEL[nivelTreino(b)] ?? 99;
      return nivelA - nivelB || compararTexto(a.titulo, b.titulo);
    }
    return compararTexto(a.titulo, b.titulo);
  });
  return lista;
}

export function opcoesPresentes(itens, campo) {
  return [...new Set(itens.map((item) => item[campo]).filter(Boolean))]
    .sort((a, b) => compararTexto(a, b));
}

export function textoContagem(quantidade, singular, plural) {
  if (quantidade === 0) return `Nenhum ${singular} encontrado.`;
  if (quantidade === 1) return `1 ${singular} encontrado.`;
  return `${quantidade} ${plural} encontrados.`;
}
