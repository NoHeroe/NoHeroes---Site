/** Tailwind do site NoHeroes — config única (antes vinha inline em cada página, via CDN).
 *  Rode `npm run build:css` depois de mudar classes; o assets/css/tw.css gerado é versionado. */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js', './assets/i18n/**/*.js'],
  theme: {
    extend: {
      colors: {
        nh: { bg: '#07060a', dark: '#0c0a10', accent: '#8f4fff', gold: '#d9b55a', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
        roxo: '#a855f7', dourado: '#facc15', cinza: '#1f1f1f', fundo: '#0a0a0a', claro: '#f4f4f4',
      },
      boxShadow: { glow: '0 0 20px rgba(168,85,247,.35)' },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
