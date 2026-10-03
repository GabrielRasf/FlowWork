export function erro(status, mensagem) {
  const falha = new Error(mensagem);
  falha.status = status;
  return falha;
}

export function json(res, status, corpo) {
  res.status(status).json(corpo);
}

export function criarHandler(metodos) {
  return async function handler(req, res) {
    try {
      const metodo = req.method || 'GET';
      const acao = metodos[metodo];
      if (!acao) {
        res.setHeader('Allow', Object.keys(metodos).join(', '));
        return json(res, 405, { erro: 'Método não permitido' });
      }
      if (metodo !== 'GET' && metodo !== 'HEAD') {
        exigirEscritaSegura(req);
      }
      await acao(req, res);
    } catch (falha) {
      if (falha.code === '23514' || falha.code === '22001') {
        return json(res, 400, { erro: 'Dados inválidos' });
      }
      if (falha.code === '23503') {
        return json(res, 404, { erro: 'Registro relacionado não encontrado' });
      }
      const status = Number.isInteger(falha.status) ? falha.status : 500;
      if (status >= 500) {
        console.error('Erro na API', falha.code || 'sem-codigo');
      }
      const mensagem = status >= 500 ? 'Falha ao processar a solicitação' : falha.message;
      return json(res, status, { erro: mensagem });
    }
  };
}

function exigirEscritaSegura(req) {
  const tipo = cabecalho(req, 'content-type');
  if (!tipo || !tipo.toLowerCase().startsWith('application/json')) {
    throw erro(415, 'O conteúdo precisa ser JSON');
  }
  const origem = cabecalho(req, 'origin');
  if (!origem) {
    throw erro(403, 'Origem não permitida');
  }
  let url;
  try {
    url = new URL(origem);
  } catch {
    throw erro(403, 'Origem não permitida');
  }
  if (url.host !== hostDoPedido(req)) {
    throw erro(403, 'Origem não permitida');
  }
}

function hostDoPedido(req) {
  const encaminhado = cabecalho(req, 'x-forwarded-host');
  const bruto = encaminhado || cabecalho(req, 'host') || '';
  return bruto.split(',')[0].trim();
}

function cabecalho(req, nome) {
  const valor = req.headers?.[nome];
  if (Array.isArray(valor)) return valor[0] || '';
  return valor || '';
}
