/* linktree.html — o PT está no HTML (menos os textos que o script troca). */
(function (D) {
  Object.assign(D.pt, {
    'lt.som_on': 'Som: ON',
    'lt.som_off': 'Som: OFF',
  });
  // nomes próprios e textos iguais nas duas línguas
  var iguais = { 2: '✦ Manual da Ancestralidade', 3: '✦ Pousada Cantos da Mata', 4: '✦ Brazil Wild Nature', 8: 'Webnovel NoHeroes',
    9: '✦ PT', 10: 'Português', 11: '✦ EN', 12: 'English', 18: 'Natalia', 19: 'Pixabay', 20: 'Music by', 21: 'from' };
  Object.keys(iguais).forEach(function (n) { D.en['ltm.' + n] = iguais[n]; });
  Object.assign(D.en, {
    'ltp.meta.titulo': 'NoHeroes | Links',
    'ltp.meta.descricao': 'All the links for Raul Takagi and NoHeroes: tattoos, the webnovel Anjo Devorador, the book, the store and socials.',
    'ltp.og.titulo': 'NoHeroes | Links',
    'lt.slogan': 'From scratch. No support. With soul.<br>I created worlds and I want to show you how.',
    'lt.btn_agendar': 'Book a tattoo',
    'lt.btn_ler': 'Read Anjo Devorador',
    'lt.btn_portfolio_tattoo': 'Tattoo portfolio',
    'lt.btn_insta_tattoo': 'Instagram NoHeroes Tattoo',
    'lt.btn_store': 'Store',
    'lt.btn_support': 'Vitalist Support',
    'lt.btn_webnovel_title': 'Webnovel',
    'lt.btn_webnovel_sub': 'Read Online',
    'lt.btn_other_projects': 'Partner projects ↗',
    'lt.modal_title': 'Partner projects',
    'lt.som_on': 'Sound: ON',
    'lt.som_off': 'Sound: OFF',
    'lt.alt_logo': 'NoHeroes logo',
  });
})(window.NH_DICT = window.NH_DICT || { pt: {}, en: {} });
