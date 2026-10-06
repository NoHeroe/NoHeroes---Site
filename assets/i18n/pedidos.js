/* Pedidos e endereços — usado por checkout, agradecimento e perfil. */
(function (D) {
  const PT = {
    'ped.pag.pending': 'Aguardando pagamento', 'ped.pag.awaiting_manual_confirmation': 'Pix em verificação',
    'ped.pag.approved': 'Pago', 'ped.pag.needs_attention': 'Pago — em análise', 'ped.pag.rejected': 'Pagamento recusado',
    'ped.pag.cancelled': 'Cancelado', 'ped.pag.refunded': 'Estornado', 'ped.pag.charged_back': 'Contestado',
    'ped.ent.na': 'Digital', 'ped.ent.pending': 'A preparar', 'ped.ent.preparing': 'Em preparação',
    'ped.ent.shipped': 'Enviado', 'ped.ent.delivered': 'Entregue', 'ped.ent.returned': 'Devolvido',
    'ped.ev.created': 'Pedido criado', 'ped.ev.awaiting_confirmation': 'Aguardando Pix', 'ped.ev.payment_approved': 'Pagamento aprovado',
    'ped.ev.payment_rejected': 'Pagamento recusado', 'ped.ev.payment_status': 'Pagamento', 'ped.ev.needs_attention': 'Em análise',
    'ped.ev.fulfillment': 'Entrega', 'ped.ev.tracking_updated': 'Rastreio', 'ped.ev.cancelled': 'Cancelado',
    'ped.ev.refunded': 'Estornado', 'ped.ev.charged_back': 'Contestado',
    'ped.sem_eventos': 'Sem eventos.',
    'end.padrao': 'padrão',
    'end.buscando': 'Buscando CEP…',
    'end.cep_nao_achado': 'CEP não encontrado (ou serviço fora do ar). Preencha o endereço à mão.',
    'end.cep_ok': 'Endereço encontrado. Confira e informe o número.',
  };
  const EN = {
    'ped.pag.pending': 'Awaiting payment', 'ped.pag.awaiting_manual_confirmation': 'Pix being verified',
    'ped.pag.approved': 'Paid', 'ped.pag.needs_attention': 'Paid — under review', 'ped.pag.rejected': 'Payment declined',
    'ped.pag.cancelled': 'Cancelled', 'ped.pag.refunded': 'Refunded', 'ped.pag.charged_back': 'Disputed',
    'ped.ent.na': 'Digital', 'ped.ent.pending': 'To be prepared', 'ped.ent.preparing': 'Being prepared',
    'ped.ent.shipped': 'Shipped', 'ped.ent.delivered': 'Delivered', 'ped.ent.returned': 'Returned',
    'ped.ev.created': 'Order created', 'ped.ev.awaiting_confirmation': 'Awaiting Pix', 'ped.ev.payment_approved': 'Payment approved',
    'ped.ev.payment_rejected': 'Payment declined', 'ped.ev.payment_status': 'Payment', 'ped.ev.needs_attention': 'Under review',
    'ped.ev.fulfillment': 'Delivery', 'ped.ev.tracking_updated': 'Tracking', 'ped.ev.cancelled': 'Cancelled',
    'ped.ev.refunded': 'Refunded', 'ped.ev.charged_back': 'Disputed',
    'ped.sem_eventos': 'No events.',
    'end.cep': 'Postal code (CEP)', 'end.uf': 'State (UF)', 'end.rua': 'Street', 'end.numero': 'Number',
    'end.complemento': 'Apt, unit…', 'end.bairro': 'Neighborhood', 'end.cidade': 'City', 'end.destinatario': 'Recipient',
    'end.telefone': 'Phone', 'end.apelido': 'Nickname', 'end.apelido_ph': 'Home, Work…', 'end.salvar': 'Save address',
    'end.so_brasil': 'We only ship within Brazil.',
    'end.padrao': 'default',
    'end.buscando': 'Looking up the postal code…',
    'end.cep_nao_achado': 'Postal code not found (or the service is down). Fill in the address manually.',
    'end.cep_ok': 'Address found. Check it and add the number.',
  };
  Object.assign(D.pt, PT);
  Object.assign(D.en, EN);
})(window.NH_DICT = window.NH_DICT || { pt: {}, en: {} });
