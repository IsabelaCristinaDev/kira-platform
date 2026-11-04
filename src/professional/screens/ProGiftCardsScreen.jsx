// Gift Cards · mock
import { Gift, Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { DemoNotice } from "../../shared/components/demo";
import { Sheet } from "../../shared/components/Sheet";
import { Header, inputStyle, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { proGiftCardsMock } from "../data/mocks";

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

        {proGiftCardsMock.length === 0 ? (
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
              Nenhum gift card vendido ainda.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}
          >
            {proGiftCardsMock.map((gc) => (
              <div
                key={gc.id}
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
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-lg)",
                    background: gradientKira,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Gift size={17} color={colors.primaryForeground} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 700,
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {gc.code}
                  </p>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      margin: "var(--space-1) 0 0",
                    }}
                  >
                    Comprado por {gc.buyer}
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-2)" }}
                >
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 700,
                      color: colors.primaryText,
                    }}
                  >
                    R$ {gc.value}
                  </span>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      color: gc.status === "ativo" ? colors.primaryText : colors.mutedForeground,
                    }}
                  >
                    {gc.status === "ativo" ? "Ativo" : "Usado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
