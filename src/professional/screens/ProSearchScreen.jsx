// Buscar (profissional): apresentação visual de profissionais próximos · demonstração, dados dos mocks, regras a definir
import { MapPin, Search, Star } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { ContactAvatar } from "../../shared/components/conversations";
import { DemoBanner, DemoNotice } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function ProSearchScreen() {
  const { goToProTab } = useSession();
  const [query, setQuery] = useState("");
  const [noticeId, setNoticeId] = useState(null);
  const q = normalize(query.trim());
  const nearby = [...mockProfessionals]
    .sort((a, b) => a.distance - b.distance)
    .filter((p) => normalize(`${p.name} ${p.role}`).includes(q));

  return (
    <ScreenFrame
      title="Buscar parcerias"
      subtitle="Encontre outros profissionais para parcerias."
      footer={<ProBottomNav active="proSearch" onNavigate={goToProTab} />}
    >
      <DemoBanner>Busca de parcerias em demonstração visual: as regras desta busca ainda serão definidas.</DemoBanner>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-10)",
          background: colors.muted,
          borderRadius: "var(--radius-pill)",
          padding: "var(--space-12) var(--space-16)",
          marginBottom: "var(--space-16)",
        }}
      >
        <Search size={16} color={colors.mutedForeground} aria-hidden="true" />
        <label htmlFor="pro-search" className="k-sr-only">
          Buscar parceiros
        </label>
        <input
          id="pro-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar parceiros..."
          autoComplete="off"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: fontBody,
            fontSize: "var(--font-size-sm)",
            color: colors.foreground,
          }}
        />
      </div>
      {nearby.length === 0 ? (
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
          Nenhum profissional encontrado.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
          {nearby.map((p) => (
            <article
              key={p.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "var(--space-12)",
                padding: "var(--space-12) var(--space-14)",
                borderRadius: "var(--radius-2xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <ContactAvatar contact={p} size={56} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    fontSize: "var(--font-size-sm)",
                    color: colors.foreground,
                    margin: 0,
                    overflowWrap: "anywhere",
                  }}
                >
                  {p.name}
                </h2>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: "var(--space-1) 0 var(--space-4)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {p.role}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "var(--space-8)",
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <Star size={11} color={colors.accent} fill={colors.accent} aria-hidden="true" /> {p.rating} (
                    {p.reviews})
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <MapPin size={11} aria-hidden="true" /> {p.distance} km
                  </span>
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="button"
                  onClick={() => setNoticeId(p.id)}
                  style={{
                    minHeight: 44,
                    width: "100%",
                    marginTop: "var(--space-8)",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${colors.border}`,
                    background: colors.muted,
                    color: colors.foreground,
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: "var(--font-size-xs)",
                    cursor: "pointer",
                  }}
                >
                  Propor parceria
                </button>
                <DemoNotice show={noticeId === p.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </ScreenFrame>
  );
}
