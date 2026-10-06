/* linktree.html — dicionário que vivia dentro da página (migrado para o sistema único). O PT está no HTML. */
(function (D) {
  Object.assign(D.pt, {
    'lt.som_on': 'Som: ON',
    'lt.som_off': 'Som: OFF',
  });
  // nomes próprios e textos iguais nas duas línguas (marcados por tools/i18n-marcar.py)
  var iguais = { 1: 'NoHeroes', 2: '✦ Manual da Ancestralidade', 3: '✦ Pousada Cantos da Mata', 4: '✦ Brazil Wild Nature', 5: 'NoHeroes', 6: 'PT', 7: 'EN',
    8: 'Webnovel NoHeroes', 9: '✦ PT', 10: 'Português', 11: '✦ EN', 12: 'English', 13: 'YouTube', 14: 'Instagram', 15: 'TikTok', 16: 'Discord',
    17: 'WhatsApp', 18: 'Natalia', 19: 'Pixabay', 20: 'Music by', 21: 'from' };
  Object.keys(iguais).forEach(function (n) { D.en['ltm.' + n] = iguais[n]; });
  Object.assign(D.en, {
    'ltp.meta.titulo': 'NoHeroes | Links',
    'ltp.meta.descricao': 'All the links for Raul Takagi and NoHeroes: tattoos, the webnovel Anjo Devorador, the book, the store and socials.',
    'ltp.og.titulo': 'NoHeroes | Links',
    'lt.slogan': 'From scratch. No support. With soul.<br>I created worlds and I want to show you how.',
    'lt.btn_explore': 'Explore NoHeroes Website',
    'lt.btn_portfolio': 'Tattoo & Portfolio',
    'lt.btn_acda': 'NoHeroes — Ashes of Tomorrow (Book)',
    'lt.btn_store': 'Store',
    'lt.btn_support': 'Vitalist Support',
    'lt.btn_webnovel_title': 'Webnovel',
    'lt.btn_webnovel_sub': 'Read Online',
    'lt.btn_other_projects': 'Other NoHeroes Projects ↗',
    'lt.sec_social': 'Social Media',
    'lt.sec_communities': 'Communities',
    'lt.drawer_subtitle': 'Dark Universe',
    'lt.drawer_footer': 'No heroes. Just you.',
    'lt.nav_home': 'Home',
    'lt.nav_home_tag': 'Portal',
    'lt.nav_store': 'Store',
    'lt.nav_store_tag': 'Market',
    'lt.nav_about': 'About',
    'lt.nav_about_tag': 'Entity',
    'lt.nav_support': 'Support',
    'lt.nav_support_tag': 'Help',
    'lt.nav_portfolio': 'Portfolio',
    'lt.nav_portfolio_tag': 'Works',
    'lt.modal_title': 'Other projects',
    'lt.modal_coming_soon': '✦ Coming soon...',
    'lt.som_on': 'Sound: ON',
    'lt.som_off': 'Sound: OFF',
    'lt.alt_logo': 'NoHeroes logo',
    'lt.alt_acda': 'Cover — NoHeroes: As Cinzas do Amanhã',
  });
})(window.NH_DICT = window.NH_DICT || { pt: {}, en: {} });
