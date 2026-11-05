// Esqueci a senha: pede o e-mail e manda o link de redefinição · API: kira-backend (POST /api/auth/recuperar-senha)
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { api, errorMessage } from "../api";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "../components/ui";
import { forgotPasswordSchema, validate } from "../schemas/forms";
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

export default function ForgotPasswordScreen() {
  const { setScreen } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const send = useMutation({ mutationFn: () => api.auth.requestPasswordReset(email) });

  const submit = () => {
    const { ok, errors } = validate(forgotPasswordSchema, { email: email.trim() });
    setError(errors.email ?? null);
    if (ok) send.mutate();
  };

  if (send.isSuccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header onBack={() => setScreen("login")} />
        <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-32)" }}>
          <MailCheck size={40} color={colors.primaryText} style={{ marginBottom: "var(--space-12)" }} />
          <h1 style={title}>Confira seu e-mail</h1>
          <p role="status" style={subtitle}>
            Se houver uma conta com <strong>{email.trim()}</strong>, enviamos um link para criar uma nova senha. Ele
            vale por 30 minutos. Não chegou? Confira o spam.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            <PrimaryButton onClick={() => setScreen("login")}>Voltar para o login</PrimaryButton>
            <SecondaryButton onClick={() => setScreen("resetPassword")}>Tenho um código</SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("login")} />
      <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-32)" }}>
        <h1 style={title}>Esqueceu a senha?</h1>
        <p style={subtitle}>Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.</p>
        <Field label="E-mail" error={error}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="seu@email.com"
            autoComplete="email"
            style={inputStyle(!!error)}
          />
        </Field>
        {send.isError && (
          <p
            role="alert"
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.destructiveText,
              margin: "0 0 var(--space-12)",
            }}
          >
            {errorMessage(send.error, "Não foi possível enviar agora. Tente novamente.")}
          </p>
        )}
        <PrimaryButton disabled={!email.trim() || send.isPending} onClick={submit}>
          {send.isPending ? "Enviando..." : "Enviar link"}
        </PrimaryButton>
      </div>
    </div>
  );
}
