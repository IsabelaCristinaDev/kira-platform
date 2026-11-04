// Conversas entre cliente e profissional: avatar, lista, balões e campo de digitação (apresentação visual) · API: nenhuma
import { MessageCircle, Send } from "lucide-react";
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

export const ConversationList = ({ items, onOpen }) => {
  if (items.length === 0) {
    return (
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
        <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}>
          Nenhuma conversa por aqui ainda.
        </p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
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

export const MessageBubbles = ({ messages }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
    {messages.map((m) => {
      const mine = m.from === "me";
      return (
        <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "80%" }}>
          <div
            style={{
              padding: "var(--space-10) var(--space-14)",
              borderRadius: "var(--radius-2xl)",
              borderBottomRightRadius: mine ? "var(--radius-xs)" : undefined,
              borderBottomLeftRadius: mine ? undefined : "var(--radius-xs)",
              background: mine ? gradientKira : colors.muted,
              color: mine ? colors.primaryForeground : colors.foreground,
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              lineHeight: 1.4,
              overflowWrap: "anywhere",
            }}
          >
            {m.text}
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              textAlign: mine ? "right" : "left",
              marginTop: "var(--space-2)",
            }}
          >
            {m.time}
          </div>
        </div>
      );
    })}
  </div>
);

// Campo de digitação só para mostrar o layout: não envia nada
export const ComposerPreview = () => (
  <div
    style={{
      padding: "var(--space-12) var(--space-16) var(--space-16)",
      borderTop: `1px solid ${colors.border}`,
      background: colors.background,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-8)",
        minHeight: 52,
        padding: "0 var(--space-4) 0 var(--space-18)",
        borderRadius: "var(--radius-pill)",
        background: colors.muted,
        border: `1px solid ${colors.border}`,
        boxSizing: "border-box",
      }}
    >
      <label htmlFor="composer-demo" className="k-sr-only">
        Escreva uma mensagem
      </label>
      <input
        id="composer-demo"
        type="text"
        disabled
        placeholder="Escreva uma mensagem"
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          background: "transparent",
          fontFamily: fontBody,
          fontSize: "var(--font-size-base)",
          color: colors.foreground,
        }}
      />
      <button
        type="button"
        disabled
        aria-label="Enviar mensagem (indisponível na demonstração)"
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-round)",
          border: "none",
          background: "var(--color-primary-tint)",
          color: colors.foreground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "not-allowed",
        }}
      >
        <Send size={20} aria-hidden="true" />
      </button>
    </div>
    <p
      style={{
        fontFamily: fontBody,
        fontSize: "var(--font-size-xs)",
        color: colors.mutedForeground,
        textAlign: "center",
        margin: "var(--space-8) 0 0",
      }}
    >
      Envio de mensagens indisponível: demonstração visual.
    </p>
  </div>
);
