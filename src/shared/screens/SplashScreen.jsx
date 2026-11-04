// Abertura do app (Entrar / Criar conta) · API: nenhuma
import { useSession } from "../../context/SessionContext";
import { colors, fontBody, fontDisplay } from "../theme";

export default function SplashScreen() {
  const { setScreen } = useSession();
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--space-24)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 15%, var(--color-orange-glow), transparent 45%), radial-gradient(circle at 82% 10%, var(--color-pink-light), transparent 50%), radial-gradient(circle at 88% 55%, var(--color-magenta), transparent 55%), radial-gradient(circle at 8% 68%, var(--color-amber-glow), transparent 50%), radial-gradient(circle at 50% 92%, hsl(var(--white-hsl) / 0.55), transparent 60%), linear-gradient(180deg, var(--color-primary-tint), var(--color-neutral-soft))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "hsl(var(--white-hsl) / 0.1)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-40)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-12)" }}>
          <h1
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-hero)",
              lineHeight: 1,
              color: colors.primaryForeground,
              margin: 0,
              textShadow: "var(--text-shadow-md)",
            }}
          >
            K
          </h1>
          <p
            style={{
              fontFamily: fontDisplay,
              fontSize: "var(--font-size-4xl)",
              color: colors.primaryForeground,
              margin: 0,
              textShadow: "var(--text-shadow-sm)",
            }}
          >
            Kira
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.primaryForeground,
              opacity: 0.9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "var(--space-8)",
            }}
          >
            Beleza com confiança
          </p>
        </div>
        <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
          <button
            onClick={() => setScreen("login")}
            style={{
              width: "100%",
              padding: "var(--space-16)",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: "hsl(var(--white-hsl) / 0.95)",
              color: colors.foreground,
              fontWeight: 600,
              fontSize: "var(--font-size-md)",
              fontFamily: fontBody,
              cursor: "pointer",
              boxShadow: "var(--shadow-card-glow)",
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setScreen("signup")}
            style={{
              width: "100%",
              padding: "var(--space-16)",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: "hsl(var(--primary-hsl) / 0.3)",
              color: colors.primaryForeground,
              fontWeight: 600,
              fontSize: "var(--font-size-md)",
              fontFamily: fontBody,
              cursor: "pointer",
            }}
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}
