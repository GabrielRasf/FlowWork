  // Abre o modalAdd commentMore actions
function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}

// Fecha o modal
function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Fechar o modal clicando fora dele
window.onclick = function(event) {
  const modais = ['modal-entrar', 'modal-inscrever', 'modal-criar'];
  modais.forEach(id => {
      const modal = document.getElementById(id);
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });
};

// Versão do Gabriel