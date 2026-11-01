// Perfil: ajuda e suporte · estático
import { HelpCircle, MessageCircle } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { Header, ProfileMenuRow, ProfileSection, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Ajuda e suporte ===
export default function ClientHelpSupportScreen() {
  const { setScreen } = useSession();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Ajuda e suporte
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Como podemos ajudar?
        </p>
        <ProfileSection title="Dúvidas frequentes">
          {["Como funciona o Provador virtual?", "Como altero um agendamento?", "Como funciona o pagamento?"].map(
            (q, i, arr) => (
              <ProfileMenuRow key={q} icon={HelpCircle} label={q} last={i === arr.length - 1} onClick={() => {}} />
            ),
          )}
        </ProfileSection>
        <SecondaryButton onClick={() => setScreen("clientChat")}>
          <MessageCircle size={15} /> Conversar com o suporte
        </SecondaryButton>
      </div>
    </div>
  );
}
