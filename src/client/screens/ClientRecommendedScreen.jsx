// Recomendado pela IA: lista dedicada com ordenação, filtro, justificativa, perfil e agendamento · API: kira-backend (estúdios) · compatibilidade: cálculo local em recommendation.js, sem IA de imagem
import { MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { DemoBanner } from "../../shared/components/demo";
import { Chip } from "../../shared/components/primitives";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody } from "../../shared/theme";
import { CompatibilityBadge, ProPhoto, ratingLabel } from "../components/ProfessionalCards";
import { useProfessionals } from "../hooks/useProfessionals";
import { categoryOptions } from "../data/options";
import { recommendProfessionals } from "../recommendation";
import { matchesCategory } from "../utils/categories";

const SORTS = [
  { id: "compat", label: "Compatibilidade", by: (a, b) => b.compatibility - a.compatibility },
  { id: "dist", label: "Distância", by: (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity) },
  { id: "rating", label: "Avaliação", by: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) },
];

// Justificativa montada só com dados que o profissional já tem (categoria, distância, nota)
const reasonOf = (p) =>
  [
    p.role ? `${p.role}` : "Estúdio da plataforma",
    p.distance != null ? `a ${p.distance.toFixed(1).replace(".", ",")} km de você` : null,
    p.rating != null
      ? `nota ${p.rating}${p.reviews != null ? ` (${p.reviews} avaliações)` : ""}`
      : "ainda sem avaliações",
  ]
    .filter(Boolean)
    .join(", ") + ".";

export default function ClientRecommendedScreen() {
  const { setScreen } = useSession();
  const { setSelectedProId, setBookedSlot, resetScheduling } = useScheduling();
  const professionals = useProfessionals();
  const [sort, setSort] = useState("compat");
  const [category, setCategory] = useState("todos");
  const all = useMemo(
    () => (professionals.data ? recommendProfessionals(professionals.data, { category: "todos", limit: 12 }) : []),
    [professionals.data],
  );
  const categories = categoryOptions;
  const list = all.filter((p) => matchesCategory(p, category)).sort(SORTS.find((s) => s.id === sort).by);
  const open = (p, screen) => {
    setSelectedProId(p.id);
    setBookedSlot(null);
    if (screen === "clientScheduling") resetScheduling();
    setScreen(screen);
  };
  return (
    <ScreenFrame
      onBack={() => setScreen("clientTryOnResult")}
      title="Recomendado pela IA"
      subtitle="Profissionais que combinam com você."
    >
      <DemoBanner>
        A compatibilidade é calculada no app com os dados do estúdio; ainda não há análise de imagem por IA.
      </DemoBanner>
      <div
        role="group"
        aria-label="Ordenar por"
        className="k-hscroll"
        style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-8)" }}
      >
        {SORTS.map((s) => (
          <Chip key={s.id} style={{ minHeight: 44 }} active={sort === s.id} onClick={() => setSort(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>
      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="k-hscroll"
        style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-16)" }}
      >
        {categories.map((c) => (
          <Chip key={c.id} style={{ minHeight: 44 }} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>
      {professionals.isLoading ? (
        <SkeletonLoading count={3} />
      ) : professionals.isError ? (
        <ErrorState
          onRetry={professionals.refetch}
          message={errorMessage(professionals.error, "Não foi possível carregar as recomendações agora.")}
        />
      ) : list.length === 0 ? (
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-sm)",
            color: colors.mutedForeground,
            textAlign: "center",
            padding: "var(--space-32) 0",
            margin: 0,
          }}
        >
          Nenhum profissional recomendado nesta categoria.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
          {list.map((p) => (
            <article
              key={p.id}
              style={{
                borderRadius: "var(--radius-3xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
                padding: "var(--space-14)",
              }}
            >
              <CompatibilityBadge value={p.compatibility} />
              <div style={{ display: "flex", gap: "var(--space-12)", margin: "var(--space-12) 0" }}>
                <ProPhoto pro={p} size={64} radius="var(--radius-2xl)" />
                <div style={{ minWidth: 0, flex: 1, fontFamily: fontBody }}>
                  <h2
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: "var(--font-size-md)",
                      color: colors.foreground,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {p.name}
                  </h2>
                  <p
                    style={{
                      margin: "var(--space-1) 0 var(--space-4)",
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                    }}
                  >
                    {p.role}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-8)",
                      alignItems: "center",
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <Star size={11} color={colors.accent} fill={colors.accent} aria-hidden="true" /> {ratingLabel(p)}
                    </span>
                    {p.distance != null && (
                      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <MapPin size={11} aria-hidden="true" /> {p.distance.toFixed(1).replace(".", ",")} km
                      </span>
                    )}
                    {p.price != null && <strong style={{ color: colors.primaryText }}>R$ {p.price}</strong>}
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: "0 0 var(--space-12)",
                }}
              >
                <strong style={{ color: colors.foreground }}>Por que recomendamos: </strong>
                {reasonOf(p)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                <PrimaryButton onClick={() => open(p, "clientScheduling")}>Agendar</PrimaryButton>
                <div style={{ display: "flex", gap: "var(--space-8)" }}>
                  <SecondaryButton onClick={() => open(p, "clientProfessionalProfile")}>Ver perfil</SecondaryButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </ScreenFrame>
  );
}
