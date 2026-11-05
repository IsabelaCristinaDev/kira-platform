// Moldura do celular + atalhos de tela (dev) · API externa: Google Fonts (CSS das fontes)
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AppProviders } from "./context/AppProviders";
import { useSession } from "./context/SessionContext";
import { useHScrollInteraction } from "./shared/hooks/useHScrollInteraction";
import { colors, fontBody } from "./shared/theme";

function Prototype() {
  const { screen, setScreen, setAccountType } = useSession();
  useHScrollInteraction();

  const phoneFrame = {
    width: "min(390px, 100%)",
    height: "clamp(640px, calc(100dvh - 2 * var(--space-32)), 844px)",
    background: colors.background,
    borderRadius: "var(--radius-phone)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "var(--shadow-phone)",
    fontFamily: fontBody,
    display: "flex",
    flexDirection: "column",
  };

  const outer = {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "var(--color-page)",
    padding: "var(--space-32) var(--space-12)",
    colorScheme: "light",
  };

  const navGroups = [
    {
      label: "Início",
      screens: [
        ["Splash", "splash"],
        ["Login", "login"],
        ["Escolher tipo", "signup"],
        ["Esqueci a senha", "forgotPassword"],
        ["Nova senha", "resetPassword"],
      ],
    },
    {
      label: "Cliente",
      accountType: "client",
      screens: [
        ["Dados", "clientPersonal"],
        ["Endereço", "clientAddress"],
        ["Localização", "clientLocation"],
        ["Documento", "clientDocument"],
        ["Selfie", "clientSelfie"],
        ["Termos", "clientTerms"],
        ["Concluído", "clientDone"],
        ["Personalizar", "clientPreferences"],
        ["Home (dashboard)", "clientHome"],
        ["Buscar", "clientSearch"],
        ["Perfil Pro", "clientProfessionalProfile"],
        ["Agendamento", "clientScheduling"],
        ["Provador: referência", "clientTryOnReference"],
        ["Provador: foto", "clientTryOnPhoto"],
        ["Provador: resultado", "clientTryOnResult"],
        ["Agenda", "clientAgenda"],
        ["Agenda: detalhe", "clientAgendaDetail"],
        ["Agenda: remarcar", "clientReschedule"],
        ["Agenda: conversa", "clientConversation"],
        ["Agenda: acompanhar", "clientBookingTracking"],
        ["Perfil (menu)", "clientProfile"],
        ["Perfil: editar", "clientProfileEdit"],
        ["Perfil: segurança", "clientAccountSecurity"],
        ["Perfil: privacidade", "clientPrivacyData"],
        ["Perfil: LGPD", "clientLgpdConsents"],
        ["Perfil: pagamentos", "clientPaymentMethods"],
        ["Perfil: hist. pagamentos", "clientPaymentHistory"],
        ["Perfil: cupons", "clientCoupons"],
        ["Perfil: ajuda", "clientHelpSupport"],
        ["Atendimento (chat)", "clientChat"],
        ["Perfil: avaliações", "clientReviews"],
        ["Perfil: favoritos", "clientFavorites"],
        ["Perfil: histórico", "clientHistory"],
      ],
    },
    {
      label: "Profissional",
      accountType: "professional",
      screens: [
        ["Dados", "proPersonal"],
        ["Endereço", "proAddress"],
        ["Localização", "proLocation"],
        ["Documento", "proDocument"],
        ["Selfie", "face"],
        ["Especialidades", "proSpecialties"],
        ["Serviços", "proServices"],
        ["Fotos", "proPhotos"],
        ["Termos", "proTerms"],
        ["Concluído", "proDone"],
        ["Painel", "proHome"],
        ["Agenda", "proAgendaDash"],
        ["Agenda: remarcar", "proReschedule"],
        ["Agenda: conversa", "proConversation"],
        ["Perfil (menu)", "proProfileMenu"],
        ["Horário", "proBusinessHours"],
        ["Portfólio", "proPortfolio"],
        ["Financeiro", "proFinance"],
        ["Analytics", "proAnalytics"],
        ["Gift Cards", "proGiftCards"],
        ["Fidelidade", "proLoyalty"],
        ["Segurança Kira", "proSecurity"],
        ["Ajuda", "proHelp"],
        ["Buscar (em breve)", "proSearch"],
      ],
    },
  ];

  return (
    <div style={outer} className="k-outer">
      <style>
        {
          "body, html { margin: 0; padding: 0; } .k-frame > * { min-height: 0; } @media (max-width: 480px) { .k-outer { padding: 0 !important; } .k-frame { width: 100% !important; height: 100dvh !important; border-radius: 0 !important; box-shadow: none !important; } .k-dock { padding: var(--space-12) !important; box-sizing: border-box; } } .spin { animation: kiraspin 1s linear infinite; } @keyframes kiraspin { to { transform: rotate(360deg); } }"
        }
      </style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-16)",
          width: "100%",
        }}
      >
        <div style={phoneFrame} className="k-frame" data-testid="phone-frame">
          <AppRoutes />
        </div>
        <div
          className="k-dock"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: 390 }}
        >
          {navGroups.map((group) => (
            <div
              key={group.label}
              style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 700,
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  width: 72,
                }}
              >
                {group.label}
              </span>
              {group.screens.map(([label, key]) => (
                <button
                  key={key}
                  data-testid="screen-shortcut"
                  onClick={() => {
                    // atalho do protótipo: abre a tela já como o tipo de conta da área
                    if (group.accountType) setAccountType(group.accountType);
                    setScreen(key);
                  }}
                  style={{
                    padding: "var(--space-5) var(--space-10)",
                    borderRadius: "var(--radius-pill)",
                    border: `1px solid ${screen === key ? colors.primary : colors.border}`,
                    background: screen === key ? "hsl(var(--primary-hsl) / 0.1)" : colors.card,
                    color: screen === key ? colors.primaryText : colors.mutedForeground,
                    fontSize: "var(--font-size-xs)",
                    fontFamily: fontBody,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppProviders>
        <Prototype />
      </AppProviders>
    </BrowserRouter>
  );
}
