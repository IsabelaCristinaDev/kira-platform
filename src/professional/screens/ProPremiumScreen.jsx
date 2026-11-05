// Plano Premium (R9: destaque pago, assinatura opcional) · demonstração visual: valor e benefícios ainda a definir
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoBanner, DemoNotice } from "../../shared/components/demo";
import { Badge } from "../../shared/components/primitives";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { Sheet } from "../../shared/components/Sheet";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// Só o que a Matriz de Rastreabilidade (R9) e o modelo financeiro dizem: destaque pago, assinatura opcional
const PLAN = { id: "premium", name: "Premium", price: "Valor a definir", benefits: ["Destaque pago"] };

export default function ProPremiumScreen() {
  const { setScreen } = useSession();
  const [selected, setSelected] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState(false);

  return (
    <>
      <ScreenFrame
        onBack={() => setScreen("proProfileMenu")}
        title="Plano Premium"
        subtitle="Assinatura opcional para profissionais."
      >
        <DemoBanner>Valor e benefícios do plano ainda serão definidos: esta tela mostra só o layout.</DemoBanner>
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => setSelected((s) => !s)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            boxSizing: "border-box",
            padding: "var(--space-18)",
            borderRadius: "var(--radius-3xl)",
            border: `2px solid ${selected ? colors.primary : colors.border}`,
            background: colors.card,
            boxShadow: selected ? "var(--shadow-card-glow)" : "none",
            cursor: "pointer",
            marginBottom: "var(--space-18)",
          }}
        >
          <span
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-10)" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-xl)",
                  background: gradientKira,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={18} color={colors.primaryForeground} />
              </span>
              <span
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "var(--font-size-xl)",
                  color: colors.foreground,
                }}
              >
                {PLAN.name}
              </span>
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 24,
                height: 24,
                borderRadius: "var(--radius-round)",
                border: `2px solid ${selected ? colors.primary : colors.border}`,
                background: selected ? colors.primary : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected && <Check size={14} color={colors.primaryForeground} />}
            </span>
          </span>
          <span
            style={{
              display: "block",
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.primaryText,
              margin: "var(--space-12) 0 var(--space-4)",
            }}
          >
            {PLAN.price}
          </span>
          <Badge tone="neutral">Assinatura opcional</Badge>
          <span style={{ display: "block", height: 1, background: colors.border, margin: "var(--space-14) 0" }} />
          {PLAN.benefits.map((b) => (
            <span
              key={b}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-8)",
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.foreground,
              }}
            >
              <Check size={16} color={colors.primary} aria-hidden="true" /> {b}
            </span>
          ))}
        </button>
        <PrimaryButton disabled={!selected} onClick={() => setConfirming(true)}>
          Assinar Premium
        </PrimaryButton>
        {!selected && (
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              textAlign: "center",
              margin: "var(--space-10) 0 0",
            }}
          >
            Selecione o plano para continuar.
          </p>
        )}
      </ScreenFrame>
      {confirming && (
        <Sheet
          title="Confirmar assinatura"
          onClose={() => {
            setConfirming(false);
            setNotice(false);
          }}
        >
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: "0 0 var(--space-16)",
            }}
          >
            Plano <strong>{PLAN.name}</strong>, {PLAN.price.toLowerCase()}.
          </p>
          <PrimaryButton onClick={() => setNotice(true)}>Confirmar assinatura</PrimaryButton>
          <div style={{ height: "var(--space-8)" }} />
          <SecondaryButton onClick={() => setConfirming(false)}>Voltar</SecondaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </>
  );
}
