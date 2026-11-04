// Perfil: cupons · estático
import { Gift } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoNotice } from "../../shared/components/demo";
import { Header, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// === PERFIL: Cupons e gift cards ===
export default function ClientCouponsScreen() {
  const { setScreen } = useSession();
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState(false);
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
          Cupons e gift cards
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Resgate um cupom ou gift card para usar nos seus agendamentos.
        </p>
        <div style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}>
          <input
            aria-label="Código do cupom"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setNotice(false);
            }}
            autoComplete="off"
            placeholder="Código do cupom"
            style={{ ...inputStyle(false), flex: 1, minWidth: 0 }}
          />
          <button
            type="button"
            onClick={() => setNotice(true)}
            style={{
              padding: "0 var(--space-18)",
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: gradientKira,
              color: colors.primaryForeground,
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-xs)",
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            Aplicar
          </button>
        </div>
        <DemoNotice show={notice} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-14)",
            padding: "var(--space-24) var(--space-24)",
            textAlign: "center",
          }}
        >
          <Gift size={30} color={colors.mutedForeground} />
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}
          >
            Nenhum cupom ativo no momento.
          </p>
        </div>
      </div>
    </div>
  );
}
