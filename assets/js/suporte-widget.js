/**
 * NoHeroes — Suporte Widget Universal
 * Adicione este script em qualquer página para exibir o botão flutuante de suporte.
 * 
 * USO: adicione antes do </body> em todas as páginas:
 * <script src="assets/js/suporte-widget.js"></script>
 */
(function() {
  'use strict';

  // Não exibe na própria página de suporte
  if (window.location.pathname.includes('suporte')) return;

  const styles = `
    #nh-support-fab {
      position: fixed;
      bottom: 88px;
      right: 20px;
      z-index: 9999;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8f4fff, #d9b55a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(143, 79, 255, 0.45);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
      color: #000;
      font-size: 20px;
      font-weight: 700;
    }
    #nh-support-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(143, 79, 255, 0.65);
    }
    #nh-support-fab:hover + #nh-support-label {
      opacity: 1;
      transform: translateY(0);
    }
    #nh-support-label {
      position: fixed;
      bottom: 148px;
      right: 16px;
      z-index: 9998;
      background: rgba(12, 10, 16, 0.95);
      border: 1px solid rgba(143, 79, 255, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 11px;
      font-family: 'Inter', sans-serif;
      color: #c4a3ff;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s, transform 0.2s;
    }
    @media (max-width: 480px) {
      #nh-support-fab { bottom: 80px; right: 16px; width: 46px; height: 46px; font-size: 18px; }
      #nh-support-label { display: none; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const fab = document.createElement('a');
  fab.id = 'nh-support-fab';
  fab.href = 'suporte.html';
  fab.title = 'Suporte NoHeroes';
  fab.setAttribute('aria-label', 'Abrir suporte');
  fab.innerHTML = '?';

  const label = document.createElement('div');
  label.id = 'nh-support-label';
  label.textContent = 'Precisa de ajuda?';

  document.body.appendChild(fab);
  document.body.appendChild(label);
})();
