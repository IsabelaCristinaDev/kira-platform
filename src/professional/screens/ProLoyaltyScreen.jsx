// Fidelidade: pontos e cashback · estado local
import { Check } from "lucide-react";
import { useState } from "react";
import { useProDashboard } from "../../context/ProDashboardContext";
import { useSession } from "../../context/SessionContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { Checkbox } from "../../shared/components/primitives";

// "Programa de fidelidade" — pontos, cashback e recompensas.
export default function ProLoyaltyScreen() {
  const { loyaltySettings, setLoyaltySettings } = useProDashboard();
  const { setScreen } = useSession();
  const [saved, setSaved] = useState(false);
  const change = (update) => {
    setSaved(false);
    setLoyaltySettings(update);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
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
          Programa de fidelidade
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Fidelize clientes com pontos, cashback e recompensas.
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-10)",
            padding: "var(--space-14) var(--space-16)",
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            marginBottom: "var(--space-18)",
            cursor: "pointer",
          }}
        >
          <Checkbox checked={loyaltySettings.enabled} onChange={() => change((s) => ({ ...s, enabled: !s.enabled }))} />
          <span
            style={{
              flex: 1,
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              fontWeight: 600,
            }}
          >
            Ativar programa de fidelidade
          </span>
        </label>

        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: colors.foreground,
            margin: "0 0 var(--space-8)",
          }}
        >
          Pontos por real gasto
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)", marginBottom: "var(--space-18)" }}>
          <input
            type="range"
            aria-label="Pontos por real gasto"
            min={0}
            max={5}
            step={0.5}
            value={loyaltySettings.pointsPerReal}
            onChange={(e) => change((s) => ({ ...s, pointsPerReal: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 60,
              textAlign: "right",
            }}
          >
            {loyaltySettings.pointsPerReal} pts
          </span>
        </div>

        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: colors.foreground,
            margin: "0 0 var(--space-8)",
          }}
        >
          Cashback
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)", marginBottom: "var(--space-22)" }}>
          <input
            type="range"
            aria-label="Porcentagem de cashback"
            min={0}
            max={20}
            step={1}
            value={loyaltySettings.cashbackPercent}
            onChange={(e) => change((s) => ({ ...s, cashbackPercent: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 44,
              textAlign: "right",
            }}
          >
            {loyaltySettings.cashbackPercent}%
          </span>
        </div>

        <PrimaryButton onClick={() => setSaved(true)}>Salvar configurações</PrimaryButton>
        <p
          role="status"
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: colors.primaryText,
            textAlign: "center",
            margin: "var(--space-10) 0 0",
            minHeight: "1.2em",
          }}
        >
          {saved ? "Configurações salvas" : ""}
        </p>
      </div>
    </div>
  );
}
