// Mocks do profissional: receita, analytics, agenda, gift cards, fidelidade · backend futuro
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  Gift,
  HelpCircle,
  Home,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from "lucide-react";

// ==========================================================================
// NOVO — Painel do profissional (mock)
// ==========================================================================
// Dados mockados para as telas do lado profissional descritas no folheto
// "Kira para Profissionais": painel com métricas e faturamento semanal,
// agenda com confirmação, Gift Cards, transações e fidelização. Tudo 100%
// aditivo — nenhuma estrutura, dado ou tela do cliente foi alterada.
export const proWeeklyRevenue = [
  { label: "Seg", value: 420 },
  { label: "Ter", value: 380 },
  { label: "Qua", value: 510 },
  { label: "Qui", value: 460 },
  { label: "Sex", value: 600 },
  { label: "Sáb", value: 980 },
  { label: "Dom", value: 240 },
];

// Faturamento por semana do mês corrente, usado na alternância
// "Semana / Mês" da tela de gestão financeira (Financeiro).
export const proMonthlyRevenue = [
  { label: "S1", value: 2860 },
  { label: "S2", value: 3120 },
  { label: "S3", value: 2740 },
  { label: "S4", value: 3590 },
];

export const proDashboardStats = { clientsToday: 6, weeklyRevenue: 1240, rating: 4.9, revenueDelta: 18 };

// Dados para a tela de Analytics: atendimentos por dia, serviços mais
// procurados, distribuição de avaliações e métricas-resumo de desempenho.
export const proAppointmentsWeekMock = [
  { label: "Seg", value: 3 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 4 },
  { label: "Qui", value: 3 },
  { label: "Sex", value: 5 },
  { label: "Sáb", value: 7 },
  { label: "Dom", value: 1 },
];

export const proServiceRankingMock = [
  { service: "Escova modeladora", count: 18, revenue: 720 },
  { service: "Manicure completa", count: 14, revenue: 560 },
  { service: "Coloração", count: 9, revenue: 990 },
  { service: "Design de sobrancelhas", count: 7, revenue: 210 },
];

// Clientes já usados em outros mocks do lado profissional (proUpcomingMock,
// proAgendaMock, proTransactionsMock) — reaproveitados aqui como o "elenco"
// de clientes por trás dos totais de `proServiceRankingMock`.
export const proServiceClientsPool = ["Ana Souza", "Rafael Lima", "Beatriz Nunes", "Camila Alves"];

// Detalhamento por cliente de um serviço (tela Analytics > "Serviços mais
// procurados"). Mock determinístico — distribui o total de atendimentos do
// serviço entre o elenco de clientes já existente, sem inventar dado novo
// desconectado do total. No futuro, substituir pelo agrupamento real de
// atendimentos por cliente/serviço vindo do backend, mantendo o mesmo
// formato de retorno para não exigir mudanças na tela.
export const getServiceClientBreakdown = (serviceEntry) => {
  const names = proServiceClientsPool;
  const hash = serviceEntry.service.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const rotated = names.map((_, i) => names[(i + hash) % names.length]);
  const base = Math.floor(serviceEntry.count / names.length);
  const remainder = serviceEntry.count % names.length;
  const clients = rotated
    .map((name, i) => {
      const visits = base + (i < remainder ? 1 : 0);
      const daysAgo = ((hash + i * 7) % 20) + 1;
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - daysAgo);
      return {
        name,
        visits,
        lastDate: lastDate.toLocaleDateString("pt-BR"),
        totalSpent: Math.round((visits / serviceEntry.count) * serviceEntry.revenue),
        daysAgo,
      };
    })
    .filter((c) => c.visits > 0);
  return clients.sort((a, b) => b.visits - a.visits || a.daysAgo - b.daysAgo);
};

export const proRatingBreakdownMock = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

export const proAnalyticsSummary = { avgTicket: 62, retentionRate: 68, completionRate: 94 };

export const proUpcomingMock = [
  { id: "pa1", client: "Ana Souza", time: "10:30", service: "Coloração" },
  { id: "pa2", client: "Rafael Lima", time: "13:00", service: "Corte" },
  { id: "pa3", client: "Beatriz Nunes", time: "15:30", service: "Escova" },
];

// Agenda do profissional por dia (mock). Chave = "ano-mês-dia" (mês
// zero-indexado, igual ao Date do JS) relativa a hoje, para sempre ter dados
// de exemplo nos primeiros dias em que o protótipo for aberto.
export const proAgendaMock = {};

(function seedProAgenda() {
  const base = new Date();
  const samples = [
    [
      { client: "Ana Souza", time: "10:30", service: "Coloração", status: "confirmado" },
      { client: "Rafael Lima", time: "13:00", service: "Corte", status: "confirmado" },
    ],
    [{ client: "Beatriz Nunes", time: "09:00", service: "Escova", status: "pendente" }],
    [],
    [{ client: "Camila Alves", time: "16:00", service: "Hidratação", status: "confirmado" }],
  ];
  samples.forEach((dayAppointments, offset) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    proAgendaMock[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] = dayAppointments;
  });
})();

export const proGiftCardsMock = [
  { id: "gc1", code: "KIRA-8F2A", value: 100, buyer: "Ana Souza", status: "ativo" },
  { id: "gc2", code: "KIRA-3D91", value: 50, buyer: "Rafael Lima", status: "usado" },
];

export const proTransactionsMock = [
  { id: "tx1", client: "Ana Souza", service: "Coloração", date: "Hoje", value: 180, method: "Pix" },
  { id: "tx2", client: "Rafael Lima", service: "Corte", date: "Ontem", value: 60, method: "Cartão" },
  { id: "tx3", client: "Beatriz Nunes", service: "Escova", date: "12/07", value: 70, method: "Gift Card Kira" },
];

export const initialLoyaltySettings = { enabled: true, pointsPerReal: 1, cashbackPercent: 5 };

// Menu de Perfil do profissional — mesma lógica do clientProfileMenu (cada
// linha navega para uma tela própria via `go`).
export const proProfileMenu = [
  {
    title: "Minha atividade",
    items: [
      { label: "Minha agenda", icon: Calendar, go: "proAgendaDash" },
      { label: "Financeiro", icon: CreditCard, go: "proFinance" },
      { label: "Meus clientes", icon: User, go: "proClients" },
      { label: "Conversas", icon: MessageCircle, go: "proConversations" },
      { label: "Notificações", icon: Bell, go: "proNotifications" },
    ],
  },
  {
    title: "Ganhos e recompensas",
    items: [
      { label: "Gift Cards Kira", icon: Gift, go: "proGiftCards" },
      { label: "Programa de fidelidade", icon: Star, go: "proLoyalty" },
      { label: "Plano Premium", icon: Sparkles, go: "proPremium" },
    ],
  },
  {
    title: "Segurança e confiança",
    items: [{ label: "Segurança Kira", icon: ShieldCheck, go: "proSecurity" }],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, go: "proHelp" }],
  },
];

// Destinos da bottom nav do profissional, conforme o mockup do folheto
// "Kira para Profissionais" (Início, Buscar, Analytics, Agenda, Perfil).
// Componente próprio (ProBottomNav) — o BottomNav do cliente não é alterado.
export const proBottomNavItems = [
  { label: "Início", icon: Home, key: "proHome" },
  { label: "Buscar", icon: Search, key: "proSearch" },
  { label: "Analytics", icon: BarChart3, key: "proAnalytics" },
  { label: "Agenda", icon: Calendar, key: "proAgendaDash" },
  { label: "Perfil", icon: User, key: "proProfileMenu" },
];
