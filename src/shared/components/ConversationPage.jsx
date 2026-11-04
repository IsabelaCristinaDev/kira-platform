// Tela da conversa: cabeçalho com o contato, balões de exemplo e campo de digitação visual · API: nenhuma
import { colors, fontBody } from "../theme";
import { demoMessages } from "../data/demo";
import { ContactAvatar, ComposerPreview, MessageBubbles } from "./conversations";
import { DemoBanner } from "./demo";
import { Header } from "./ui";

export const ConversationPage = ({ contact, onBack }) => (
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
      <div style={{ minWidth: 0 }}>
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
        <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}>
          {contact.subtitle}
        </p>
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-16) var(--space-24)" }}>
      <DemoBanner>Conversa de demonstração: as mensagens são de exemplo e nada é enviado.</DemoBanner>
      <MessageBubbles messages={demoMessages} />
    </div>
    <ComposerPreview />
  </div>
);
