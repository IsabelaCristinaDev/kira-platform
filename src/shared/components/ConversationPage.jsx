// Tela da conversa: cabeçalho com o contato e atalhos, balões de exemplo, aviso sem conexão e campo de digitação visual · API: nenhuma
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { colors, fontBody } from "../theme";
import { chatImageDemo, demoMessages } from "../data/demo";
import { ContactAvatar, ComposerPreview, MessageBubbles } from "./conversations";
import { DemoBanner } from "./demo";
import { Header } from "./ui";

const messages = [...demoMessages, chatImageDemo];

const useOnline = () => {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
};

// actions: [{ label, onClick }] com os atalhos do perfil (ver perfil, agendar, ver agendamento)
export const ConversationPage = ({ contact, onBack, actions = [] }) => {
  const online = useOnline();
  const [previewOffline, setPreviewOffline] = useState(false);
  const offline = !online || previewOffline;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={onBack} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-12)",
          padding: "0 var(--space-24) var(--space-12)",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <ContactAvatar contact={contact} size={44} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.foreground,
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {contact.name}
          </h1>
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}
          >
            {contact.subtitle}
          </p>
        </div>
      </div>
      {actions.length > 0 && (
        <div
          className="k-hscroll"
          style={{
            display: "flex",
            gap: "var(--space-8)",
            padding: "var(--space-8) var(--space-24)",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="k-chip"
              onClick={a.onClick}
              style={{
                minHeight: 44,
                padding: "0 var(--space-16)",
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: colors.muted,
                color: colors.foreground,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: "var(--font-size-xs)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      {offline && (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            padding: "var(--space-8) var(--space-24)",
            background: "hsl(var(--accent-hsl) / 0.14)",
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.foreground,
          }}
        >
          <WifiOff size={14} aria-hidden="true" /> Sem conexão. As mensagens aparecem quando a conexão voltar.
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-16) var(--space-24)" }}>
        <DemoBanner>Conversa de demonstração: as mensagens são de exemplo e nada é enviado.</DemoBanner>
        <MessageBubbles messages={messages} />
        <button
          type="button"
          onClick={() => setPreviewOffline((v) => !v)}
          style={{
            display: "block",
            margin: "var(--space-16) auto 0",
            minHeight: 44,
            border: "none",
            background: "transparent",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {previewOffline ? "Ocultar estado sem conexão" : "Visualizar estado sem conexão"}
        </button>
      </div>
      <ComposerPreview />
    </div>
  );
};
