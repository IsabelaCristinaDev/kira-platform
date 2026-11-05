// Estados de carregamento (skeleton), vazio e erro, e aviso de recurso simulado · API: nenhuma
import { AlertCircle, SearchX } from "lucide-react";
import { colors, fontBody } from "../theme";
import { PrimaryButton, SecondaryButton } from "./ui";

export const SkeletonCard = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-12)",
      padding: "var(--space-12)",
      borderRadius: "var(--radius-2xl)",
      border: `1px solid ${colors.border}`,
      background: colors.card,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "var(--radius-xl)",
        background: colors.muted,
        animation: "kiraPulse 1.2s ease-in-out infinite",
      }}
    />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div
        style={{
          width: "55%",
          height: 11,
          borderRadius: "var(--radius-xs)",
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "35%",
          height: 9,
          borderRadius: "var(--radius-xs)",
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "45%",
          height: 9,
          borderRadius: "var(--radius-xs)",
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
    </div>
  </div>
);

export const SkeletonLoading = ({ count = 5 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
    <style>{"@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }"}</style>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const EmptyState = ({ onClear }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-14)",
      padding: "var(--space-48) var(--space-24)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "var(--radius-round)",
        background: colors.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SearchX size={30} color={colors.mutedForeground} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}>
      Nenhum profissional encontrado.
    </p>
    <div style={{ width: "100%", maxWidth: 220 }}>
      <SecondaryButton onClick={onClear}>Limpar filtros</SecondaryButton>
    </div>
  </div>
);

export const ErrorState = ({ onRetry, message = "Não foi possível carregar os profissionais agora." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-14)",
      padding: "var(--space-48) var(--space-24)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "var(--radius-round)",
        background: "hsl(var(--destructive-hsl) / 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AlertCircle size={30} color={colors.destructive} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}>
      {message}
    </p>
    <div style={{ width: "100%", maxWidth: 220 }}>
      <PrimaryButton onClick={onRetry}>Tentar novamente</PrimaryButton>
    </div>
  </div>
);

// Recurso ainda sem backend: deixa claro que o que aparece na tela não é real
export const DemoNotice = ({ children }) => (
  <p
    role="note"
    style={{
      margin: 0,
      padding: "var(--space-10) var(--space-12)",
      borderRadius: "var(--radius-lg)",
      background: colors.muted,
      color: colors.foreground,
      fontFamily: fontBody,
      fontSize: "var(--font-size-xs)",
    }}
  >
    <strong>Demonstração:</strong> {children}
  </p>
);
