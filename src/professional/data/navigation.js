// Menu do perfil e navegação do profissional · sem API
import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  Gift,
  HelpCircle,
  Home,
  Search,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

export const proProfileMenu = [
  {
    title: "Minha atividade",
    items: [
      { label: "Minha agenda", icon: Calendar, go: "proAgendaDash" },
      { label: "Horário de funcionamento", icon: Clock, go: "proBusinessHours" },
      { label: "Financeiro", icon: CreditCard, go: "proFinance" },
    ],
  },
  {
    title: "Ganhos e recompensas",
    items: [
      { label: "Gift Cards Kira", icon: Gift, go: "proGiftCards" },
      { label: "Programa de fidelidade", icon: Star, go: "proLoyalty" },
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

export const proBottomNavItems = [
  { label: "Início", icon: Home, key: "proHome" },
  { label: "Buscar", icon: Search, key: "proSearch" },
  { label: "Analytics", icon: BarChart3, key: "proAnalytics" },
  { label: "Agenda", icon: Calendar, key: "proAgendaDash" },
  { label: "Perfil", icon: User, key: "proProfileMenu" },
];
