// Tabela de rotas: chave da tela (screen) → caminho da URL, por área (compartilhada, /cliente, /profissional) · API: nenhuma

const area = (prefix, rows) => Object.fromEntries(rows.map(([key, path]) => [key, `${prefix}/${path}`]));

export const sharedPaths = {
  splash: "/",
  login: "/entrar",
  signup: "/criar-conta",
  home: "/inicio",
};

export const clientPaths = area("/cliente", [
  ["clientPersonal", "cadastro/dados"],
  ["clientAddress", "cadastro/endereco"],
  ["clientLocation", "cadastro/localizacao"],
  ["clientDocument", "cadastro/documento"],
  ["clientSelfie", "cadastro/selfie"],
  ["clientTerms", "cadastro/termos"],
  ["clientDone", "cadastro/concluido"],
  ["clientPreferences", "preferencias"],
  ["clientHome", "inicio"],
  ["clientSearch", "buscar"],
  ["clientProfessionalProfile", "profissional"],
  ["clientScheduling", "agendamento"],
  ["clientTryOnReference", "provador/referencia"],
  ["clientTryOnPhoto", "provador/foto"],
  ["clientTryOnResult", "provador/resultado"],
  ["clientAgenda", "agenda"],
  ["clientAgendaDetail", "agenda/detalhe"],
  ["clientBookingTracking", "agenda/acompanhar"],
  ["clientProfile", "perfil"],
  ["clientProfileEdit", "perfil/editar"],
  ["clientAccountSecurity", "perfil/seguranca"],
  ["clientPrivacyData", "perfil/privacidade"],
  ["clientLgpdConsents", "perfil/lgpd"],
  ["clientPaymentMethods", "perfil/pagamentos"],
  ["clientPaymentHistory", "perfil/historico-pagamentos"],
  ["clientCoupons", "perfil/cupons"],
  ["clientHelpSupport", "perfil/ajuda"],
  ["clientFaq", "perfil/ajuda/perguntas"],
  ["clientConversations", "conversas"],
  ["clientConversation", "conversas/conversa"],
  ["clientNotifications", "notificacoes"],
  ["clientChat", "atendimento"],
  ["clientReviews", "perfil/avaliacoes"],
  ["clientFavorites", "perfil/favoritos"],
  ["clientHistory", "perfil/historico"],
]);

export const professionalPaths = area("/profissional", [
  ["proPersonal", "cadastro/dados"],
  ["proAddress", "cadastro/endereco"],
  ["proLocation", "cadastro/localizacao"],
  ["proDocument", "cadastro/documento"],
  ["face", "cadastro/selfie"],
  ["proSpecialties", "cadastro/especialidades"],
  ["proServices", "cadastro/servicos"],
  ["proPhotos", "cadastro/fotos"],
  ["proTerms", "cadastro/termos"],
  ["proDone", "cadastro/concluido"],
  ["proHome", "painel"],
  ["proAgendaDash", "agenda"],
  ["proProfileMenu", "perfil"],
  ["proFinance", "financeiro"],
  ["proAnalytics", "analytics"],
  ["proGiftCards", "gift-cards"],
  ["proLoyalty", "fidelidade"],
  ["proSecurity", "seguranca"],
  ["proHelp", "ajuda"],
  ["proFaq", "ajuda/perguntas"],
  ["proConversations", "conversas"],
  ["proConversation", "conversas/conversa"],
  ["proNotifications", "notificacoes"],
  ["proPremium", "premium"],
  ["proSearch", "buscar"],
]);

export const routePaths = { ...sharedPaths, ...clientPaths, ...professionalPaths };

export const CLIENT_HOME = routePaths.clientHome;
export const PRO_HOME = routePaths.proHome;

const keyByPath = Object.fromEntries(Object.entries(routePaths).map(([key, path]) => [path, key]));

// Caminho de uma tela; chave desconhecida volta para a abertura.
export const pathFor = (key) => routePaths[key] ?? routePaths.splash;

// Chave da tela de um caminho (ignora barra final); null se não existir.
export const keyFor = (pathname) => keyByPath[pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname] ?? null;
