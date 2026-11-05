// Fidelidade Kira do cliente: pontos, cashback, histórico e recompensas · valores de exemplo, regras a definir
import { Gift, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoBanner, DemoNotice } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { Sheet } from "../../shared/components/Sheet";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { loyaltyDemo } from "../../shared/data/demo";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

const h2 = {
  fontFamily: fontDisplay,
  fontWeight: 700,
  fontSize: "var(--font-size-base)",
  color: colors.foreground,
  margin: "0 0 var(--space-10)",
};
const small = { fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 };

export default function ClientLoyaltyScreen() {
  const { setScreen } = useSession();
  const [reward, setReward] = useState(null);
  const [notice, setNotice] = useState(false);
  const close = () => {
    setReward(null);
    setNotice(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      <ScreenFrame
        onBack={() => setScreen("clientProfile")}
        title="Fidelidade Kira"
        subtitle="Quanto mais usa, mais ganha."
      >
        <DemoBanner>Valores de exemplo. Regras de acúmulo, conversão e cashback ainda serão definidas.</DemoBanner>
        <div style={{ display: "flex", gap: "var(--space-10)", marginBottom: "var(--space-20)", flexWrap: "wrap" }}>
          <div
            style={{
              flex: "2 1 160px",
              borderRadius: "var(--radius-3xl)",
              background: gradientKira,
              color: colors.primaryForeground,
              padding: "var(--space-16)",
              fontFamily: fontBody,
            }}
          >
            <p style={{ margin: 0, fontSize: "var(--font-size-xs)" }}>Seus pontos (exemplo)</p>
            <p
              style={{
                margin: "var(--space-4) 0 0",
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-2xl)",
              }}
            >
              {loyaltyDemo.points.toLocaleString("pt-BR")}
            </p>
          </div>
          <div
            style={{
              flex: "1 1 110px",
              borderRadius: "var(--radius-3xl)",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              padding: "var(--space-16)",
              fontFamily: fontBody,
            }}
          >
            <p style={{ ...small }}>Cashback (exemplo)</p>
            <p
              style={{
                margin: "var(--space-4) 0 0",
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
              }}
            >
              {loyaltyDemo.cashback}
            </p>
          </div>
        </div>

        <h2 style={h2}>Como funciona</h2>
        <p style={{ ...small, marginBottom: "var(--space-20)" }}>
          Regra a definir. O programa vai reconhecer quem usa o Kira a cada agendamento.
        </p>

        <h2 style={h2}>Recompensas</h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}
        >
          {loyaltyDemo.rewards.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-12)",
                padding: "var(--space-12) var(--space-14)",
                borderRadius: "var(--radius-xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <Gift size={18} color={colors.primaryText} aria-hidden="true" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: "var(--font-size-sm)",
                    color: colors.foreground,
                  }}
                >
                  {r.title}
                </p>
                <p style={small}>{r.cost}</p>
              </div>
              <button
                type="button"
                className="k-chip"
                onClick={() => setReward(r)}
                style={{
                  minHeight: 44,
                  padding: "0 var(--space-14)",
                  borderRadius: "var(--radius-pill)",
                  border: "none",
                  background: colors.muted,
                  color: colors.foreground,
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: "var(--font-size-xs)",
                  cursor: "pointer",
                }}
              >
                Resgatar
              </button>
            </div>
          ))}
        </div>

        <h2 style={h2}>Histórico de pontos</h2>
        {loyaltyDemo.history.length === 0 ? (
          <p style={small}>Nenhum ponto registrado ainda.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
            }}
          >
            {loyaltyDemo.history.map((h) => (
              <li
                key={h.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "var(--space-10)",
                  padding: "var(--space-10) var(--space-14)",
                  borderRadius: "var(--radius-xl)",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  fontFamily: fontBody,
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "var(--font-size-sm)",
                      color: colors.foreground,
                    }}
                  >
                    {h.label}
                  </span>
                  <span style={{ ...small, display: "block" }}>
                    {h.detail} · {h.time}
                  </span>
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "var(--font-size-sm)",
                    color: colors.primaryText,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                  }}
                >
                  <Sparkles size={12} aria-hidden="true" /> {h.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </ScreenFrame>
      {reward && (
        <Sheet title="Resgatar recompensa" onClose={close}>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: "0 0 var(--space-16)",
            }}
          >
            <strong>{reward.title}</strong>. {reward.cost}.
          </p>
          <PrimaryButton onClick={() => setNotice(true)}>Confirmar resgate</PrimaryButton>
          <div style={{ height: "var(--space-8)" }} />
          <SecondaryButton onClick={close}>Voltar</SecondaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </div>
  );
}
