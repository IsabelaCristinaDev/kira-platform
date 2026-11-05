// Perfil: formas de pagamento · estático, sem gateway
import { Check, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoBanner, DemoNotice } from "../../shared/components/demo";
import { Sheet } from "../../shared/components/Sheet";
import { Header, inputStyle, PrimaryButton } from "../../shared/components/ui";
import { cardsDemo } from "../../shared/data/demo";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// === PERFIL: Formas de pagamento ===
export default function ClientPaymentMethodsScreen() {
  const { setScreen } = useSession();
  const [mainId, setMainId] = useState(cardsDemo.find((c) => c.main)?.id);
  const [adding, setAdding] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background, position: "relative" }}
    >
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
          Formas de pagamento
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Adicione um cartão ou use Pix na hora de agendar.
        </p>
        <DemoBanner>Cartões de exemplo. Nenhum dado de pagamento é coletado ou salvo nesta tela.</DemoBanner>
        <div
          role="radiogroup"
          aria-label="Cartão principal"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)", marginBottom: "var(--space-20)" }}
        >
          {cardsDemo.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={mainId === c.id}
              onClick={() => setMainId(c.id)}
              style={{
                textAlign: "left",
                boxSizing: "border-box",
                width: "100%",
                padding: "var(--space-16)",
                borderRadius: "var(--radius-3xl)",
                border: `2px solid ${mainId === c.id ? colors.primary : "transparent"}`,
                background: gradientKira,
                color: colors.primaryForeground,
                fontFamily: fontBody,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-14)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--space-8)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
                  <CreditCard size={16} aria-hidden="true" /> {c.label}
                </span>
                {mainId === c.id && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-4)",
                      background: "hsl(var(--white-hsl) / 0.3)",
                      borderRadius: "var(--radius-pill)",
                      padding: "var(--space-2) var(--space-8)",
                    }}
                  >
                    <Check size={12} aria-hidden="true" /> Principal
                  </span>
                )}
              </span>
              <span style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, letterSpacing: 2 }}>
                •••• •••• •••• {c.last4}
              </span>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)" }}>
                <span>{c.holder}</span>
                <span>{c.expires}</span>
              </span>
            </button>
          ))}
        </div>
        <PrimaryButton onClick={() => setAdding(true)}>
          <Plus size={15} /> Adicionar cartão
        </PrimaryButton>
      </div>
      {adding && (
        <Sheet title="Adicionar cartão" onClose={() => setAdding(false)}>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              margin: "0 0 var(--space-14)",
            }}
          >
            Formulário de demonstração: os campos estão desativados e nenhum dado de pagamento é coletado.
          </p>
          {["Número do cartão", "Nome impresso no cartão", "Validade", "CVV"].map((label) => (
            <div key={label} style={{ marginBottom: "var(--space-10)" }}>
              <label
                htmlFor={`card-${label}`}
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
                id={`card-${label}`}
                disabled
                placeholder="Indisponível na demonstração"
                style={{ ...inputStyle(false), width: "100%", boxSizing: "border-box" }}
              />
            </div>
          ))}
          <PrimaryButton disabled onClick={() => {}}>
            Salvar cartão
          </PrimaryButton>
          <DemoNotice show />
        </Sheet>
      )}
    </div>
  );
}
