// Nova senha: o código vem no link do e-mail (?token=) ou é colado · API: kira-backend (POST /api/auth/redefinir-senha)
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { ApiError, api, errorMessage } from "../api";
import { Field, Header, PrimaryButton, inputStyle } from "../components/ui";
import { resetPasswordSchema, validate } from "../schemas/forms";
import { colors, fontBody, fontDisplay } from "../theme";

const title = {
  fontFamily: fontDisplay,
  fontWeight: 700,
  fontSize: "var(--font-size-3xl)",
  color: colors.foreground,
  margin: "var(--space-4) 0 var(--space-4)",
};
const subtitle = {
  fontFamily: fontBody,
  fontSize: "var(--font-size-sm)",
  color: colors.mutedForeground,
  margin: "0 0 var(--space-24)",
};

// O backend responde "Token inválido", "Token expirado" ou "Token já utilizado": para a tela, é tudo link vencido
const isBadToken = (e) => e instanceof ApiError && e.code === "REGRA_DE_NEGOCIO" && /token/i.test(e.message);

export default function ResetPasswordScreen() {
  const { setScreen } = useSession();
  const [params] = useSearchParams();
  const linkToken = params.get("token") ?? "";
  const [form, setForm] = useState({ token: linkToken, password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const save = useMutation({ mutationFn: () => api.auth.resetPassword(form) });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const submit = () => {
    const result = validate(resetPasswordSchema, form);
    setErrors(result.errors);
    if (result.ok) save.mutate();
  };

  if (save.isSuccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header onBack={() => setScreen("login")} />
        <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-32)" }}>
          <CheckCircle2 size={40} color={colors.primaryText} style={{ marginBottom: "var(--space-12)" }} />
          <h1 style={title}>Senha alterada</h1>
          <p role="status" style={subtitle}>
            Pronto! Agora é só entrar com a nova senha.
          </p>
          <PrimaryButton onClick={() => setScreen("login")}>Entrar</PrimaryButton>
        </div>
      </div>
    );
  }

  const passwordInput = (field, label, autoComplete) => (
    <Field label={label} error={errors[field]}>
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={form[field]}
          onChange={set(field)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoComplete={autoComplete}
          placeholder="••••••••"
          style={inputStyle(!!errors[field])}
        />
        {field === "password" && (
          <button
            type="button"
            aria-label={showPassword ? "Ocultar a senha" : "Mostrar a senha"}
            onClick={() => setShowPassword((s) => !s)}
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
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </Field>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("login")} />
      <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-32)" }}>
        <h1 style={title}>Criar nova senha</h1>
        <p style={subtitle}>Use pelo menos 8 caracteres, com uma letra maiúscula e um número.</p>
        {!linkToken && (
          <Field label="Código do e-mail" error={errors.token}>
            <input
              type="text"
              value={form.token}
              onChange={set("token")}
              autoComplete="one-time-code"
              placeholder="Cole aqui o código"
              style={inputStyle(!!errors.token)}
            />
          </Field>
        )}
        {passwordInput("password", "Nova senha", "new-password")}
        {passwordInput("confirm", "Repita a nova senha", "new-password")}
        {save.isError && (
          <div role="alert" style={{ margin: "0 0 var(--space-12)" }}>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
                margin: 0,
              }}
            >
              {isBadToken(save.error)
                ? "Este link é inválido ou já expirou."
                : errorMessage(save.error, "Não foi possível alterar a senha agora.")}
            </p>
            {isBadToken(save.error) && (
              <button
                type="button"
                className="k-reset"
                onClick={() => setScreen("forgotPassword")}
                style={{
                  color: colors.primaryText,
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "var(--space-4)",
                }}
              >
                Pedir um novo link
              </button>
            )}
          </div>
        )}
        <PrimaryButton disabled={save.isPending} onClick={submit}>
          {save.isPending ? "Salvando..." : "Salvar nova senha"}
        </PrimaryButton>
      </div>
    </div>
  );
}
