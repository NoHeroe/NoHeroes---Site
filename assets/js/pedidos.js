/* ============================================================
   NoHeroes — rótulos e formatação de pedidos (agradecimento, perfil, admin).
   Os códigos vêm do backend (config/shop.js): ORDER_STATUS e FULFILLMENT_STATUS.
   ============================================================ */
(function () {
  'use strict';
  var PAGAMENTO = {
    pending:                      { txt: 'Aguardando pagamento',  cor: '#facc15' },
    awaiting_manual_confirmation: { txt: 'Pix em verificação',    cor: '#facc15' },
    approved:                     { txt: 'Pago',                  cor: '#4ade80' },
    needs_attention:              { txt: 'Pago — em análise',     cor: '#fb923c' },
    rejected:                     { txt: 'Pagamento recusado',    cor: '#f87171' },
    cancelled:                    { txt: 'Cancelado',             cor: '#a1a1aa' },
    refunded:                     { txt: 'Estornado',             cor: '#a1a1aa' },
    charged_back:                 { txt: 'Contestado',            cor: '#f87171' }
  };
  var ENTREGA = {
    na:        { txt: 'Digital',          cor: '#c084fc' },
    pending:   { txt: 'A preparar',       cor: '#a1a1aa' },
    preparing: { txt: 'Em preparação',    cor: '#facc15' },
    shipped:   { txt: 'Enviado',          cor: '#60a5fa' },
    delivered: { txt: 'Entregue',         cor: '#4ade80' },
    returned:  { txt: 'Devolvido',        cor: '#f87171' }
  };
  var EVENTO = {
    created: 'Pedido criado',
    awaiting_confirmation: 'Aguardando Pix',
    payment_approved: 'Pagamento aprovado',
    payment_rejected: 'Pagamento recusado',
    payment_status: 'Pagamento',
    needs_attention: 'Em análise',
    stock_decremented: 'Estoque baixado',
    stock_returned: 'Estoque devolvido',
    access_revoked: 'Acesso revogado',
    fulfillment: 'Entrega',
    tracking_updated: 'Rastreio',
    note: 'Observação',
    cancelled: 'Cancelado',
    refunded: 'Estornado',
    charged_back: 'Contestado'
  };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function selo(mapa, cod) {
    var m = mapa[cod] || { txt: cod || '—', cor: '#a1a1aa' };
    return '<span style="display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;' +
      'border:1px solid ' + m.cor + '66;color:' + m.cor + ';background:' + m.cor + '14">' + esc(m.txt) + '</span>';
  }
  window.NHPedido = {
    PAGAMENTO: PAGAMENTO,
    ENTREGA: ENTREGA,
    esc: esc,
    brl: function (n) { return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); },
    data: function (d) { return d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'; },
    seloPagamento: function (cod) { return selo(PAGAMENTO, cod); },
    seloEntrega: function (cod) { return selo(ENTREGA, cod); },
    rotuloPagamento: function (cod) { return (PAGAMENTO[cod] || { txt: cod }).txt; },
    rotuloEntrega: function (cod) { return (ENTREGA[cod] || { txt: cod }).txt; },
    rotuloEvento: function (tipo) { return EVENTO[tipo] || tipo; },
    metodo: function (p) { return p === 'pix_direto' ? 'Pix' : p === 'mercadopago' ? 'Mercado Pago' : (p || '—'); },
    endereco: function (a) {
      if (!a) return '';
      var cep = String(a.cep || '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
      return esc(a.recipient_name) + '<br>' + esc(a.street) + ', ' + esc(a.number) +
        (a.complement ? ' – ' + esc(a.complement) : '') + '<br>' + esc(a.district) + ' · ' +
        esc(a.city) + '/' + esc(a.state) + ' · CEP ' + esc(cep);
    },
    /** Linha do tempo (eventos do cliente ou do admin). */
    timeline: function (eventos) {
      if (!eventos || !eventos.length) return '<p style="font-size:12px;color:rgba(255,255,255,.45)">Sem eventos.</p>';
      return '<ol style="list-style:none;margin:0;padding:0;border-left:2px solid rgba(168,85,247,.35)">' +
        eventos.map(function (e) {
          return '<li style="position:relative;padding:0 0 12px 14px">' +
            '<span style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:99px;background:#a855f7"></span>' +
            '<div style="font-size:11px;color:rgba(255,255,255,.5)">' + esc(window.NHPedido.data(e.created_at)) + ' · ' + esc(window.NHPedido.rotuloEvento(e.type)) + '</div>' +
            '<div style="font-size:13px">' + esc(e.message || '') + '</div></li>';
        }).join('') + '</ol>';
    }
  };
})();
