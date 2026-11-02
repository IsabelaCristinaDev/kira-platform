// Opções fixas do cliente: categorias, filtros padrão, abas da agenda, menu do perfil e navegação · sem API
import {
  BadgeCheck,
  Bookmark,
  Calendar,
  Clock,
  CreditCard,
  Gift,
  Heart,
  HelpCircle,
  Home,
  MapPin,
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

export const defaultSearchFilters = { price: 500, minRating: 0, maxDistance: 30, mode: "ambos", sort: "proximo" };

export const appointmentTabs = [
  { id: "proximo", label: "Próximos" },
  { id: "concluido", label: "Concluídos" },
  { id: "cancelado", label: "Cancelados" },
];

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

export const bottomNavItems = [
  { label: "Home", icon: Home, key: "clientHome" },
  { label: "Buscar", icon: Search, key: "clientSearch" },
  { label: "Provador", icon: Wand2, key: "clientTryOnReference" },
  { label: "Agenda", icon: Calendar, key: "clientAgenda" },
  { label: "Perfil", icon: User, key: "clientProfile" },
];

// Categoria do filtro → categoria do serviço no backend (ver utils/categories.js)
export const categoryToApi = {
  cabelo: "CABELO",
  barba: "BARBA",
  barbearia: "BARBA",
  unhas: "UNHAS",
  pedicure: "UNHAS",
  estetica: "ESTETICA",
  massagem: "MASSAGEM",
  cilios: "CILIOS",
  sobrancelhas: "SOBRANCELHAS",
  maquiagem: "MAQUIAGEM",
  makeup: "MAQUIAGEM",
};

// Reserva para profissionais sem categoria nos serviços: reconhece por palavras no nome,
// na descrição e nos serviços.
export const categoryKeywords = {
  cabelo: ["cabel", "corte", "escova", "color", "hidrata", "penteado", "progressiva", "mecha", "luzes"],
  barba: ["barba", "barbear", "navalha"],
  barbearia: ["barba", "barbear", "navalha"],
  unhas: ["unha", "manicure", "pedicure", "esmalta", "nail", "alongamento"],
  pedicure: ["pedicure"],
  estetica: ["estétic", "estetic", "limpeza de pele", "peeling", "facial"],
  massagem: ["massag", "drenagem"],
  cilios: ["cílio", "cilio", "lash"],
  sobrancelhas: ["sobrancelha", "brow"],
  maquiagem: ["maquiag", "make"],
  makeup: ["maquiag", "make"],
};
