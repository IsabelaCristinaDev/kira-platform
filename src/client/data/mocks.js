// Mocks do cliente: categorias, agenda, perfil e extras de portfólio · backend futuro
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Calendar,
  Clock,
  CreditCard,
  Gift,
  Heart,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Scissors,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Wand2,
} from "lucide-react";

export const preferenceCategories = [
  { id: "cabelo", emoji: "💇", label: "Cabelo" },
  { id: "unhas", emoji: "💅", label: "Unhas" },
  { id: "cilios", emoji: "👁️", label: "Cílios" },
  { id: "sobrancelhas", emoji: "✨", label: "Sobrancelhas" },
  { id: "estetica", emoji: "💆", label: "Estética" },
  { id: "maquiagem", emoji: "💄", label: "Maquiagem" },
  { id: "pedicure", emoji: "🦶", label: "Pedicure" },
  { id: "barbearia", emoji: "💈", label: "Barbearia" },
];

export const dashboardCategories = [
  { id: "cabelo", label: "Cabelo", icon: Scissors },
  { id: "unhas", label: "Unhas", icon: Sparkles },
  { id: "estetica", label: "Estética", icon: Heart },
  { id: "makeup", label: "Makeup", icon: Sparkles },
];

export const categoryOptions = [
  { id: "todos", label: "Todos" },
  { id: "cabelo", label: "Cabelo" },
  { id: "barba", label: "Barba" },
  { id: "unhas", label: "Unhas" },
  { id: "estetica", label: "Estética" },
  { id: "massagem", label: "Massagem" },
];

// Categorias do Ranking geral (conforme especificado) — podem não ter dados
// mockados para todas ainda; o fallback de recommendProfessionals() cobre
// esse caso mostrando o catálogo completo até existirem profissionais reais
// nessas categorias.
export const rankingCategoryOptions = [
  { id: "todos", label: "Todos" },
  { id: "cabelo", label: "Cabelo" },
  { id: "unhas", label: "Unhas" },
  { id: "cilios", label: "Cílios" },
  { id: "sobrancelhas", label: "Sobrancelhas" },
  { id: "estetica", label: "Estética" },
  { id: "maquiagem", label: "Maquiagem" },
  { id: "barbearia", label: "Barbearia" },
];

export const defaultSearchFilters = { price: 500, minRating: 0, maxDistance: 30, mode: "ambos", sort: "proximo" };

// ==========================================================================
// Ranking personalizado — recomendação de profissionais
// ==========================================================================
// Dados extras de ranking para os profissionais mockados: próximo horário
// disponível e algumas fotos de portfólio (reaproveitando os picsum seeds
// já usados em outros lugares do protótipo, só que em outro tamanho).
// No backend real, isso viria do profissional (workPhotos) e da agenda dele.
export const proRankingExtras = {
  1: {
    nextSlot: "Hoje às 15:30",
    portfolio: ["https://picsum.photos/seed/kiraport1a/160/160", "https://picsum.photos/seed/kiraport1b/160/160"],
  },
  2: {
    nextSlot: "Hoje às 17:00",
    portfolio: ["https://picsum.photos/seed/kiraport2a/160/160", "https://picsum.photos/seed/kiraport2b/160/160"],
  },
  3: {
    nextSlot: "Amanhã às 09:00",
    portfolio: ["https://picsum.photos/seed/kiraport3a/160/160", "https://picsum.photos/seed/kiraport3b/160/160"],
  },
  4: {
    nextSlot: "Amanhã às 12:00",
    portfolio: ["https://picsum.photos/seed/kiraport4a/160/160", "https://picsum.photos/seed/kiraport4b/160/160"],
  },
  7: {
    nextSlot: "Hoje às 16:00",
    portfolio: ["https://picsum.photos/seed/kiraport7a/160/160", "https://picsum.photos/seed/kiraport7b/160/160"],
  },
  10: {
    nextSlot: "Hoje às 15:00",
    portfolio: ["https://picsum.photos/seed/kiraport10a/160/160", "https://picsum.photos/seed/kiraport10b/160/160"],
  },
  14: {
    nextSlot: "Amanhã às 11:00",
    portfolio: ["https://picsum.photos/seed/kiraport14a/160/160", "https://picsum.photos/seed/kiraport14b/160/160"],
  },
  18: {
    nextSlot: "Hoje às 14:30",
    portfolio: ["https://picsum.photos/seed/kiraport18a/160/160", "https://picsum.photos/seed/kiraport18b/160/160"],
  },
};

export const getRankingExtras = (pro) =>
  proRankingExtras[pro.id] || { nextSlot: "Consultar disponibilidade", portfolio: [pro.photo] };

// Detalhes extras para a tela de Perfil do Profissional (verificação, endereço,
// portfólio completo, avaliações em texto e próximos horários). Mantido
// separado de `mockProfessionals` para não reescrever a estrutura já
// existente — no backend real, viria tudo do mesmo registro do profissional.
export const proProfileExtras = {
  1: {
    verified: true,
    address: "Av. T-4, Setor Bueno, Goiânia - GO",
    portfolio: [
      "https://picsum.photos/seed/kiraprof1a/300/300",
      "https://picsum.photos/seed/kiraprof1b/300/300",
      "https://picsum.photos/seed/kiraprof1c/300/300",
    ],
    reviewComments: [
      { author: "Camila R.", stars: 5, text: "Adorei o corte, ficou exatamente como eu queria." },
      { author: "Juliana S.", stars: 5, text: "Atendimento super atencioso e pontual." },
    ],
  },
  2: {
    verified: true,
    address: "Rua 9, Setor Oeste, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof2a/300/300", "https://picsum.photos/seed/kiraprof2b/300/300"],
    reviewComments: [{ author: "Rafael M.", stars: 5, text: "Melhor barbeiro da região, recomendo." }],
  },
  10: {
    verified: true,
    address: "Av. República do Líbano, Setor Oeste, Goiânia - GO",
    portfolio: [
      "https://picsum.photos/seed/kiraprof10a/300/300",
      "https://picsum.photos/seed/kiraprof10b/300/300",
      "https://picsum.photos/seed/kiraprof10c/300/300",
    ],
    reviewComments: [
      { author: "Fernanda A.", stars: 5, text: "Nail art perfeita, super caprichosa." },
      { author: "Larissa D.", stars: 4, text: "Ótimo trabalho, só demorou um pouco mais que o previsto." },
    ],
  },
  14: {
    verified: true,
    address: "Av. T-63, Setor Bueno, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof14a/300/300", "https://picsum.photos/seed/kiraprof14b/300/300"],
    reviewComments: [{ author: "Beatriz L.", stars: 5, text: "Minha pele nunca esteve tão bem cuidada." }],
  },
};

export const getProfileExtras = (pro) =>
  proProfileExtras[pro.id] || {
    verified: pro.rating >= 4.6,
    address: `Goiânia - GO, próximo ao ${pro.neighborhood || "centro"}`,
    portfolio: [pro.photo],
    reviewComments: [],
  };

// ---------- Agenda (mock) ----------
// Estrutura pensada para já nascer no formato que o backend real (endpoint
// de agendamentos) deve devolver: profissional, serviço, data/hora, local,
// preço, forma de pagamento e status.
export const appointmentsMock = [
  {
    id: "ag1",
    proId: 1,
    service: "Corte feminino",
    date: "Hoje",
    time: "15:30",
    place: "Studio Bella",
    price: 80,
    payment: "Pix",
    status: "proximo",
  },
  {
    id: "ag2",
    proId: 10,
    service: "Alongamento em gel",
    date: "Amanhã",
    time: "10:30",
    place: "Studio Camila Rocha",
    price: 120,
    payment: "Cartão de crédito",
    status: "proximo",
  },
  {
    id: "ag3",
    proId: 2,
    service: "Corte + barba",
    date: "18/08",
    time: "11:00",
    place: "Barbearia Carlos Silva",
    price: 90,
    payment: "Pix",
    status: "concluido",
    rated: false,
  },
  {
    id: "ag4",
    proId: 14,
    service: "Limpeza de pele",
    date: "05/08",
    time: "14:00",
    place: "Espaço Vanessa Cruz",
    price: 150,
    payment: "Cartão de débito",
    status: "concluido",
    rated: true,
  },
  {
    id: "ag5",
    proId: 7,
    service: "Barba na navalha",
    date: "22/07",
    time: "16:00",
    place: "Barbearia Eduardo Ramos",
    price: 55,
    payment: "Pix",
    status: "cancelado",
  },
];

export const appointmentTabs = [
  { id: "proximo", label: "Próximos" },
  { id: "concluido", label: "Concluídos" },
  { id: "cancelado", label: "Cancelados" },
];

// ---------- Menu de Perfil da cliente ----------
// Cada linha navega para uma tela própria (render*), reaproveitando os dados
// já existentes no app (cForm, appointmentsMock) em vez de duplicá-los.
export const clientProfileMenu = [
  {
    title: "Minha conta",
    items: [
      { label: "Editar perfil", icon: Settings, go: "clientProfileEdit" },
      { label: "Dados pessoais", icon: User, go: "clientProfileEdit" },
      { label: "Endereço", icon: MapPin, go: "clientAddress" },
      { label: "Preferências", icon: Sparkles, go: "clientPreferences" },
    ],
  },
  {
    title: "Minha atividade",
    items: [
      { label: "Meus agendamentos", icon: Calendar, go: "clientAgenda" },
      { label: "Minhas avaliações", icon: Star, go: "clientReviews" },
      { label: "Profissionais favoritos", icon: Bookmark, go: "clientFavorites" },
      { label: "Histórico", icon: Clock, go: "clientHistory" },
      { label: "Conversas", icon: MessageCircle, go: "clientConversations" },
      { label: "Notificações", icon: Bell, go: "clientNotifications" },
      { label: "Fidelidade Kira", icon: Sparkles, go: "clientLoyalty" },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      { label: "Formas de pagamento", icon: CreditCard, go: "clientPaymentMethods" },
      { label: "Histórico de pagamentos", icon: Clock, go: "clientPaymentHistory" },
      { label: "Cupons e gift cards", icon: Gift, go: "clientCoupons" },
    ],
  },
  {
    title: "Privacidade e segurança",
    items: [
      { label: "Dados e privacidade", icon: ShieldCheck, go: "clientPrivacyData" },
      { label: "Consentimentos LGPD", icon: ShieldCheck, go: "clientLgpdConsents" },
      { label: "Segurança da conta", icon: BadgeCheck, go: "clientAccountSecurity" },
    ],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, go: "clientHelpSupport" }],
  },
];

// Avaliações que a cliente já deixou para profissionais atendidos (mock).
// Chaveado pelo id do agendamento em `appointmentsMock` — quando o backend
// real existir, isso vem do mesmo registro do agendamento (campo `review`).
export const clientReviewsMock = {
  ag4: { rating: 5, text: "Atendimento impecável, super recomendo!", date: "06/08" },
};

// ---------- Navegação inferior (6 destinos) ----------
export const bottomNavItems = [
  { label: "Home", icon: Home, key: "clientHome" },
  { label: "Buscar", icon: Search, key: "clientSearch" },
  { label: "Provador", icon: Wand2, key: "clientTryOnReference" },
  { label: "Agenda", icon: Calendar, key: "clientAgenda" },
  { label: "Perfil", icon: User, key: "clientProfile" },
];
