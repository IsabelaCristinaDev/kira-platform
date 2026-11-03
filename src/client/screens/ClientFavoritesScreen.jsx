// Perfil: favoritas · ids salvos nesta sessão + lista de estúdios do kira-backend
import { Bookmark } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProfessionalCard } from "../components/ProfessionalCards";
import { useProfessionals } from "../hooks/useProfessionals";

// === PERFIL: Profissionais favoritos ===
export default function ClientFavoritesScreen() {
  const { favoriteProIds } = useSearch();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const { setScreen } = useSession();
  const professionals = useProfessionals();
  const favorites = (professionals.data ?? []).filter((p) => favoriteProIds.includes(p.id));
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
          Profissionais favoritos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Toque no ícone de marcador no perfil de um profissional para salvá-lo aqui.
        </p>
        {favorites.length === 0 ? (
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
            <Bookmark size={30} color={colors.mutedForeground} />
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              Você ainda não tem profissionais favoritos.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {favorites.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                pro={pro}
                onClick={() => {
                  setSelectedProId(pro.id);
                  setBookedSlot(null);
                  setScreen("clientProfessionalProfile");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
