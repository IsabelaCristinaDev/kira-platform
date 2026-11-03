// Preferências de serviços · estado local
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { preferenceCategories } from "../data/options";

export default function ClientPreferencesScreen() {
  const { cPreferences, toggleCPreference } = useSignup();
  const { setScreen } = useSession();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("clientDone")} />
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
          ✨ Vamos personalizar sua experiência
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Escolha os serviços que mais combinam com você. Assim a Kira poderá mostrar profissionais e inspirações mais
          relevantes.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-10)",
            marginBottom: "var(--space-24)",
          }}
        >
          {preferenceCategories.map((cat) => {
            const selected = cPreferences.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCPreference(cat.id)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-6)",
                  padding: "var(--space-18)",
                  borderRadius: "var(--radius-2xl)",
                  border: `2px solid ${selected ? colors.primary : colors.border}`,
                  background: selected ? "hsl(var(--primary-hsl) / 0.08)" : colors.card,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-lg)",
                    background: selected ? gradientKira : colors.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--font-size-xl)",
                  }}
                >
                  {cat.emoji}
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--font-size-sm)",
                    color: colors.foreground,
                    fontFamily: fontBody,
                  }}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <PrimaryButton onClick={() => setScreen("clientHome")}>Continuar</PrimaryButton>
      </div>
    </div>
  );
}
