/* ============================================================
   NoHeroes — carrinho (localStorage), compartilhado por store.html e checkout.html.
   Linha: { key, id, variant_id, name, variant_label, unit_price, quantity, max_qty,
            fulfillment, imageUrl }
   O preço aqui é só uma prévia: o servidor recalcula tudo no checkout.
   ============================================================ */
(function () {
  'use strict';
  var CHAVE = 'noheroes_cart_v2';

  function ler() {
    try {
      var v = JSON.parse(localStorage.getItem(CHAVE) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (_) { return []; }
  }
  function gravar(itens) {
    try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (_) { /* sem storage */ }
    document.dispatchEvent(new CustomEvent('nh:cart', { detail: itens }));
  }
  var chave = function (id, variantId) { return String(id) + ':' + (variantId || ''); };

  window.NHCart = {
    itens: ler,
    /** Adiciona respeitando max_qty. Devolve a quantidade final da linha. */
    adicionar: function (p, qtd) {
      var itens = ler();
      var k = chave(p.id, p.variant_id);
      var linha = itens.find(function (i) { return i.key === k; });
      var max = Math.max(0, Number(p.max_qty) || 0);
      if (!linha) {
        linha = {
          key: k, id: p.id, variant_id: p.variant_id || null, name: p.name,
          variant_label: p.variant_label || null, unit_price: Number(p.unit_price) || 0,
          quantity: 0, max_qty: max, fulfillment: p.fulfillment || 'digital', imageUrl: p.imageUrl || ''
        };
        itens.push(linha);
      }
      linha.max_qty = max;
      linha.unit_price = Number(p.unit_price) || linha.unit_price;
      linha.quantity = Math.min(max, linha.quantity + Math.max(1, Number(qtd) || 1));
      if (linha.quantity <= 0) itens = itens.filter(function (i) { return i.key !== k; });
      gravar(itens);
      return linha.quantity;
    },
    definirQtd: function (k, qtd) {
      var itens = ler();
      var linha = itens.find(function (i) { return i.key === k; });
      if (!linha) return;
      linha.quantity = Math.max(1, Math.min(linha.max_qty || 1, Number(qtd) || 1));
      gravar(itens);
    },
    remover: function (k) { gravar(ler().filter(function (i) { return i.key !== k; })); },
    limpar: function () { gravar([]); },
    total: function () { return ler().reduce(function (s, i) { return s + i.unit_price * i.quantity; }, 0); },
    quantidade: function () { return ler().reduce(function (s, i) { return s + i.quantity; }, 0); },
    temFisico: function () { return ler().some(function (i) { return i.fulfillment === 'physical'; }); },
    /** Itens no formato do POST /checkout e /shipping/quote. */
    paraApi: function () {
      return ler().map(function (i) {
        var o = { id: i.id, quantity: i.quantity };
        if (i.variant_id) o.variant_id = i.variant_id;
        return o;
      });
    },
    /** Reconcilia com o catálogo atual (/shop): preço, limite, disponibilidade. Devolve avisos. */
    reconciliar: function (produtos) {
      var avisos = [];
      var itens = ler().filter(function (i) {
        var p = produtos.find(function (x) { return String(x.id) === String(i.id); });
        if (!p) { avisos.push('"' + i.name + '" saiu da loja e foi removido do carrinho.'); return false; }
        var fonte = p;
        if (i.variant_id) {
          fonte = (p.variants || []).find(function (v) { return v.id === i.variant_id; });
          if (!fonte) { avisos.push('A opção "' + i.variant_label + '" de "' + i.name + '" não está mais disponível.'); return false; }
          i.unit_price = Number(fonte.price);
        } else {
          i.unit_price = Number(p.discountReal != null ? p.discountReal : p.priceReal);
        }
        if (!fonte.available) { avisos.push('"' + i.name + (i.variant_label ? ' — ' + i.variant_label : '') + '" esgotou.'); return false; }
        i.max_qty = fonte.max_qty;
        if (i.quantity > i.max_qty) { i.quantity = i.max_qty; avisos.push('Quantidade de "' + i.name + '" ajustada ao estoque.'); }
        i.fulfillment = p.fulfillment || 'digital';
        return i.quantity > 0;
      });
      gravar(itens);
      return avisos;
    },
  };

  // Carrinho da versão anterior (só e-books): migra uma vez e apaga.
  try {
    var antigo = localStorage.getItem('noheroes_cart');
    if (antigo && !localStorage.getItem(CHAVE)) {
      var lista = JSON.parse(antigo) || [];
      gravar(lista.filter(function (i) { return i && i.id; }).map(function (i) {
        return { key: chave(i.id, null), id: i.id, variant_id: null, name: i.name, variant_label: null,
          unit_price: Number(i.priceReal) || 0, quantity: Number(i.quantity) || 1, max_qty: 10,
          fulfillment: 'digital', imageUrl: i.imageUrl || '' };
      }));
    }
    localStorage.removeItem('noheroes_cart');
  } catch (_) { /* sem storage */ }
})();
