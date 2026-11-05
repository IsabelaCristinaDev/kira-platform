// Perguntas frequentes: busca, categorias e perguntas expansíveis; sem resposta definida mostra aviso (apresentação visual) · API: nenhuma
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { colors, fontBody } from "../theme";
import { Chip } from "./primitives";

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const FaqView = ({ items }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [openId, setOpenId] = useState(null);
  const categories = [...new Set(items.map((i) => i.category))];
  const visible = items.filter(
    (i) => (category === "todas" || i.category === category) && normalize(i.question).includes(normalize(query.trim())),
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-10)",
          background: colors.muted,
          borderRadius: "var(--radius-pill)",
          padding: "var(--space-12) var(--space-16)",
          marginBottom: "var(--space-14)",
        }}
      >
        <Search size={16} color={colors.mutedForeground} aria-hidden="true" />
        <label htmlFor="faq-search" className="k-sr-only">
          Buscar nas perguntas frequentes
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nas perguntas"
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
      <div
        className="k-hscroll"
        style={{
          display: "flex",
          gap: "var(--space-8)",
          overflowX: "auto",
          paddingBottom: "var(--space-4)",
          marginBottom: "var(--space-16)",
        }}
      >
        {["todas", ...categories].map((c) => (
          <Chip key={c} style={{ minHeight: 44 }} active={category === c} onClick={() => setCategory(c)}>
            {c === "todas" ? "Todas" : c}
          </Chip>
        ))}
      </div>
      {visible.length === 0 ? (
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
          Nenhuma pergunta encontrada.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {visible.map((i) => {
            const open = openId === i.id;
            return (
              <div
                key={i.id}
                style={{
                  borderRadius: "var(--radius-2xl)",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  className="k-row"
                  aria-expanded={open}
                  aria-controls={`faq-${i.id}`}
                  onClick={() => setOpenId(open ? null : i.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-12)",
                    width: "100%",
                    padding: "var(--space-14)",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "var(--font-size-sm)",
                      color: colors.foreground,
                    }}
                  >
                    {i.question}
                  </span>
                  <ChevronDown
                    size={18}
                    color={colors.mutedForeground}
                    aria-hidden="true"
                    style={{ transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}
                  />
                </button>
                {open && (
                  <div id={`faq-${i.id}`} style={{ padding: "0 var(--space-14) var(--space-14)" }}>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-sm)",
                        color: i.answer ? colors.foreground : colors.mutedForeground,
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {i.answer ??
                        "Resposta ainda não disponível. O conteúdo desta pergunta será definido pela equipe do Kira."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
