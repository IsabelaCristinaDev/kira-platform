// Gift Cards · sem API: o backend ainda não tem gift cards
import { Gift, Plus } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { Header, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// "Gift Cards Kira" — vender/acompanhar gift cards como forma de pagamento.
export default function ProGiftCardsScreen() {
  const { setScreen } = useSession();
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
        <SecondaryButton onClick={() => {}}>
          <Plus size={15} /> Criar novo Gift Card
        </SecondaryButton>
      </div>
    </div>
  );
}
