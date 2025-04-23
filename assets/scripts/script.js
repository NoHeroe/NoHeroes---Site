// Função para alternar diálogos (usada nos botões de escolha entre FREQ e ROAR)
function toggleDialog(id) {
  // Oculta todos os diálogos
  document.querySelectorAll('.dialog-box').forEach((box) => {
    box.classList.add('hidden');
  });

  // Exibe o diálogo correspondente ao botão clicado
  const dialog = document.getElementById('dialog-' + id);
  if (dialog) {
    dialog.classList.remove('hidden');
  }
}

// Função para rolar suavemente até o topo da página
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Scroll suave
  });
}

// Função para manipular o menu fixo ao rolar a página
function handleStickyHeader() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled'); // Adiciona uma classe quando rolar
  } else {
    header.classList.remove('scrolled'); // Remove a classe ao voltar ao topo
  }
}

// Adiciona eventos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Adiciona o evento de scroll para o cabeçalho fixo
  window.addEventListener('scroll', handleStickyHeader);

  // Exemplo: Adiciona comportamento extra aos botões de escolha se necessário
  document.querySelectorAll('.choice').forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.classList.contains('roar') ? 'roar' : 'freq';
      toggleDialog(id);
    });
  });

  // Mostra uma mensagem no console (apenas para teste/debug)
  console.log('JavaScript carregado com sucesso!');
});
