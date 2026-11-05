// Gift Cards · sem API: o backend ainda não tem gift cards · o formulário é visual, sem envio
import { Gift, Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoNotice } from "../../shared/components/demo";
import { Sheet } from "../../shared/components/Sheet";
import { Header, inputStyle, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// "Gift Cards Kira" — vender/acompanhar gift cards como forma de pagamento.
export default function ProGiftCardsScreen() {
  const { setScreen } = useSession();
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState(false);
  const close = () => {
    setCreating(false);
    setNotice(false);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background, position: "relative" }}
    >
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
          Gift Cards Kira
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Aceite gift cards como forma de pagamento e acompanhe os que já foram vendidos.
        </p>

        {/* O backend ainda não tem gift cards: a lista começa vazia */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-14)",
            padding: "var(--space-40) var(--space-24)",
            textAlign: "center",
          }}
        >
          <Gift size={30} color={colors.mutedForeground} />
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.mutedForeground,
              margin: 0,
            }}
          >
            Os gift cards ainda não estão disponíveis.
          </p>
        </div>
        <SecondaryButton onClick={() => setCreating(true)}>
          <Plus size={15} /> Criar novo Gift Card
        </SecondaryButton>
      </div>
      {creating && (
        <Sheet title="Criar novo Gift Card" onClose={close}>
          {["Valor", "Comprador"].map((label) => (
            <div key={label} style={{ marginBottom: "var(--space-10)" }}>
              <label
                htmlFor={`gift-${label}`}
                style={{
                  display: "block",
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.foreground,
                  marginBottom: "var(--space-4)",
                }}
              >
                {label}
              </label>
              <input
                id={`gift-${label}`}
                autoComplete="off"
                style={{ ...inputStyle(false), width: "100%", boxSizing: "border-box" }}
              />
            </div>
          ))}
          <PrimaryButton onClick={() => setNotice(true)}>Criar Gift Card</PrimaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </div>
  );
}
