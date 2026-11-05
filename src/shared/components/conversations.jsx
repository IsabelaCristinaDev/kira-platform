// Conversas entre cliente e profissional: avatar e lista com busca (apresentação) · API: nenhuma (os dados vêm de ConversationsContext)
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { colors, fontBody, gradientKira } from "../theme";
import { Badge } from "./primitives";

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const ContactAvatar = ({ contact, size = 48 }) =>
  contact.photo ? (
    <img
      src={contact.photo}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-xl)",
        objectFit: "cover",
        objectPosition: "center 25%",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-xl)",
        background: gradientKira,
        color: colors.primaryForeground,
        fontFamily: fontBody,
        fontWeight: 700,
        fontSize: "var(--font-size-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initials(contact.name)}
    </div>
  );

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const ConversationList = ({ items: all, onOpen }) => {
  const [query, setQuery] = useState("");
  const items = all.filter((c) => norm(c.name).includes(norm(query.trim())));
  const search = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-10)",
        background: colors.muted,
        borderRadius: "var(--radius-pill)",
        padding: "var(--space-12) var(--space-16)",
        marginBottom: "var(--space-12)",
      }}
    >
      <Search size={16} color={colors.mutedForeground} aria-hidden="true" />
      <label htmlFor="conversations-search" className="k-sr-only">
        Buscar conversas
      </label>
      <input
        id="conversations-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar conversas..."
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
  );
  if (items.length === 0) {
    return (
      <div>
        {all.length > 0 && search}
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
            <MessageCircle size={26} color={colors.mutedForeground} aria-hidden="true" />
          </div>
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}
          >
            {all.length === 0 ? "Nenhuma conversa por aqui ainda." : "Nenhuma conversa encontrada."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {search}
      {items.map((c) => (
        <button
          key={c.id}
          type="button"
          className="k-row"
          onClick={() => onOpen(c)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-12)",
            width: "100%",
            padding: "var(--space-12) var(--space-14)",
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <ContactAvatar contact={c} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-8)" }}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "var(--font-size-sm)",
                  color: colors.foreground,
                  overflowWrap: "anywhere",
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  flexShrink: 0,
                }}
              >
                {c.time}
              </span>
            </span>
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--space-8)",
                marginTop: "var(--space-2)",
              }}
            >
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: c.unread ? colors.foreground : colors.mutedForeground,
                  fontWeight: c.unread ? 600 : 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.last}
              </span>
              {c.unread > 0 && (
                <Badge style={{ background: gradientKira, color: colors.primaryForeground, flexShrink: 0 }}>
                  <span className="k-sr-only">Não lidas: </span>
                  {c.unread}
                </Badge>
              )}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};
