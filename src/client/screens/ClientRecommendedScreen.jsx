// Recomendado pela IA: lista dedicada com ordenação, filtro, justificativa, perfil, conversa e agendamento · dados de exemplo
import { MapPin, MessageCircle, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useConversations } from "../../context/ConversationsContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { Chip } from "../../shared/components/primitives";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody } from "../../shared/theme";
import { CompatibilityBadge } from "../components/ProfessionalCards";
import { recommendProfessionals } from "../recommendation";

const SORTS = [
  { id: "compat", label: "Compatibilidade", by: (a, b) => b.compatibility - a.compatibility },
  { id: "dist", label: "Distância", by: (a, b) => a.distance - b.distance },
  { id: "rating", label: "Avaliação", by: (a, b) => b.rating - a.rating },
];

// Justificativa montada só com dados que o profissional já tem (categoria, distância, nota)
const reasonOf = (p) =>
  `Atende ${p.category}, a ${p.distance} km de você, com nota ${p.rating} (${p.reviews} avaliações).`;

export default function ClientRecommendedScreen() {
  const { setScreen } = useSession();
  const { setSelectedProId, setBookedSlot, resetScheduling } = useScheduling();
  const { setSelectedConversationId } = useConversations();
  const [sort, setSort] = useState("compat");
  const [category, setCategory] = useState("todos");
  const all = useMemo(() => recommendProfessionals({ category: "todos", limit: 12 }), []);
  const categories = [
    { id: "todos", label: "Todos" },
    ...[...new Set(all.map((p) => p.category))].map((id) => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1) })),
  ];
  const list = all
    .filter((p) => category === "todos" || p.category === category)
    .sort(SORTS.find((s) => s.id === sort).by);
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
      <DemoBanner>Recomendações de demonstração calculadas sobre profissionais de exemplo.</DemoBanner>
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
      {list.length === 0 ? (
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
                <img
                  src={p.photo}
                  alt=""
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "var(--radius-2xl)",
                    objectFit: "cover",
                    objectPosition: "center 25%",
                    flexShrink: 0,
                  }}
                />
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
                      <Star size={11} color={colors.accent} fill={colors.accent} aria-hidden="true" /> {p.rating}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <MapPin size={11} aria-hidden="true" /> {p.distance} km
                    </span>
                    <strong style={{ color: colors.primaryText }}>R$ {p.price}</strong>
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
                  <SecondaryButton
                    onClick={() => {
                      setSelectedConversationId(`pro-${p.id}`);
                      setScreen("clientConversation");
                    }}
                  >
                    <MessageCircle size={15} aria-hidden="true" /> Conversar
                  </SecondaryButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </ScreenFrame>
  );
}
