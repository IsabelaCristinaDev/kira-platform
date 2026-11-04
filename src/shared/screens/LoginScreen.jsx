// Login simulado, sem autenticação real · API: nenhuma
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, inputStyle } from "../components/ui";
import { colors, fontBody, fontDisplay } from "../theme";

export default function LoginScreen() {
  const { setScreen } = useSession();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("splash")} />
      <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-32)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-3xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Bem-vinda de volta
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-sm)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-24)",
          }}
        >
          Entre na sua conta Kira
        </p>
        <Field label="E-mail">
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="seu@email.com"
            inputMode="email"
            autoComplete="email"
            style={inputStyle(false)}
          />
        </Field>
        <Field label="Senha">
          <div style={{ position: "relative" }}>
            <input
              type={showLoginPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={inputStyle(false)}
            />
            <button
              className="k-hit k-hit-wide"
              type="button"
              aria-label={showLoginPassword ? "Ocultar a senha" : "Mostrar a senha"}
              onClick={() => setShowLoginPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colors.mutedForeground,
                cursor: "pointer",
              }}
            >
              {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <PrimaryButton onClick={() => setScreen("home")}>Entrar</PrimaryButton>
        <p
          style={{
            textAlign: "center",
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            marginTop: "var(--space-20)",
          }}
        >
          Não tem conta?{" "}
          <button
            type="button"
            className="k-reset"
            style={{ color: colors.primaryText, fontWeight: 600, cursor: "pointer" }}
            onClick={() => setScreen("signup")}
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
}
