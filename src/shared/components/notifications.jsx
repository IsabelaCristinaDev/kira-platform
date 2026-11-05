// Central de notificações: filtro Todas/Não lidas, indicador de leitura e estado vazio (apresentação visual) · API: nenhuma
import { Bell } from "lucide-react";
import { useState } from "react";
import { colors, fontBody } from "../theme";
import { Chip } from "./primitives";

export const NotificationCenter = ({ items }) => {
  // o toque só marca como lida na tela, para mostrar o indicador de leitura; nada é gravado
  const [readIds, setReadIds] = useState(() => new Set(items.filter((n) => n.read).map((n) => n.id)));
  const [filter, setFilter] = useState("todas");
  const visible = items.filter((n) => filter === "todas" || !readIds.has(n.id));
  const unreadCount = items.filter((n) => !readIds.has(n.id)).length;

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar notificações"
        style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-16)" }}
      >
        <Chip style={{ minHeight: 44 }} active={filter === "todas"} onClick={() => setFilter("todas")}>
          Todas
        </Chip>
        <Chip style={{ minHeight: 44 }} active={filter === "nao-lidas"} onClick={() => setFilter("nao-lidas")}>
          Não lidas ({unreadCount})
        </Chip>
      </div>
      {visible.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-12)",
            padding: "var(--space-40) var(--space-24)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-round)",
              background: colors.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={26} color={colors.mutedForeground} aria-hidden="true" />
          </div>
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}
          >
            {filter === "todas" ? "Você ainda não tem notificações." : "Nenhuma notificação não lida."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {visible.map((n) => {
            const read = readIds.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                className="k-row"
                onClick={() => setReadIds((s) => new Set(s).add(n.id))}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-12)",
                  width: "100%",
                  padding: "var(--space-12) var(--space-14)",
                  borderRadius: "var(--radius-2xl)",
                  border: `1px solid ${read ? colors.border : "var(--color-primary-tint)"}`,
                  background: read ? colors.card : "hsl(var(--primary-hsl) / 0.06)",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "var(--radius-round)",
                    marginTop: "var(--space-4)",
                    flexShrink: 0,
                    background: read ? "transparent" : colors.primary,
                    border: read ? `1px solid ${colors.border}` : "none",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-8)" }}>
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontWeight: read ? 600 : 700,
                        fontSize: "var(--font-size-sm)",
                        color: colors.foreground,
                      }}
                    >
                      {n.title}
                      <span className="k-sr-only">{read ? " (lida)" : " (não lida)"}</span>
                    </span>
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                        flexShrink: 0,
                      }}
                    >
                      {n.time}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      marginTop: "var(--space-2)",
                      lineHeight: 1.4,
                    }}
                  >
                    {n.text}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      color: colors.primaryText,
                      marginTop: "var(--space-6)",
                    }}
                  >
                    {n.category}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
