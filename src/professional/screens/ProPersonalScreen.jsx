// Cadastro: dados pessoais · validação local · foto via FileReader
import { useRef, useState } from "react";
import { Camera, Eye, EyeOff, User } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { formatCnpj, formatCpf, formatPhone } from "../../shared/utils/format";

// ---------- Fluxo profissional ----------
export default function ProPersonalScreen() {
  const { handlePhoto, pErrors, pForm, setPField, validateProPersonal } = useSignup();
  const { setScreen } = useSession();
  const pFileInputRef = useRef(null);
  const [pShowPassword, setPShowPassword] = useState(false);
  const [pShowConfirm, setPShowConfirm] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={1} />
      <Header onBack={() => setScreen("signup")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Cadastro de profissional
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Complete seus dados para começar a atender clientes.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-10)",
            marginBottom: "var(--space-18)",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "var(--radius-round)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px ${pForm.photo ? "solid" : "dashed"} ${pErrors.photo ? colors.destructive : pForm.photo ? colors.primary : colors.border}`,
                background: colors.muted,
              }}
            >
              {pForm.photo ? (
                <img
                  src={pForm.photo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={30} color={colors.mutedForeground} />
              )}
            </div>
            <button
              className="k-hit"
              onClick={() => pFileInputRef.current?.click()}
              aria-label="Adicionar foto"
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 34,
                height: 34,
                borderRadius: "var(--radius-round)",
                border: "none",
                background: gradientKira,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input
            ref={pFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setPField("photo", v))}
          />
          <button
            type="button"
            className="k-reset"
            style={{
              minHeight: 44,
              padding: "0 var(--space-12)",
              fontSize: "var(--font-size-xs)",
              color: colors.primaryText,
              fontWeight: 600,
              fontFamily: fontBody,
              cursor: "pointer",
            }}
            onClick={() => pFileInputRef.current?.click()}
          >
            {pForm.photo ? "Trocar foto" : "Enviar foto de perfil"}
          </button>
          {pErrors.photo && (
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
                fontFamily: fontBody,
                margin: 0,
              }}
            >
              {pErrors.photo}
            </p>
          )}
        </div>

        <Field label="Nome completo" error={pErrors.name}>
          <input
            value={pForm.name}
            onChange={(e) => setPField("name", e.target.value)}
            placeholder="Ex.: Ana Paula Ferreira"
            style={inputStyle(pErrors.name)}
          />
        </Field>

        <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-12)" }}>
          {["cpf", "cnpj"].map((type) => (
            <button
              key={type}
              onClick={() => setPField("documentType", type)}
              style={{
                flex: 1,
                padding: "var(--space-10)",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: pForm.documentType === type ? gradientKira : colors.muted,
                color: pForm.documentType === type ? colors.primaryForeground : colors.mutedForeground,
                fontWeight: 600,
                fontSize: "var(--font-size-xs)",
                fontFamily: fontBody,
                cursor: "pointer",
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
        <Field label={pForm.documentType === "cpf" ? "CPF" : "CNPJ"} error={pErrors.document}>
          <input
            value={pForm.document}
            onChange={(e) =>
              setPField(
                "document",
                pForm.documentType === "cpf" ? formatCpf(e.target.value) : formatCnpj(e.target.value),
              )
            }
            placeholder={pForm.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
            inputMode="numeric"
            style={inputStyle(pErrors.document)}
          />
        </Field>

        <Field label="Data de nascimento" error={pErrors.birth}>
          <input
            type="date"
            value={pForm.birth}
            onChange={(e) => setPField("birth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={inputStyle(pErrors.birth)}
          />
        </Field>
        <Field label="E-mail" error={pErrors.email}>
          <input
            type="email"
            value={pForm.email}
            onChange={(e) => setPField("email", e.target.value)}
            placeholder="seu@email.com"
            inputMode="email"
            autoComplete="email"
            style={inputStyle(pErrors.email)}
          />
        </Field>
        <Field label="Telefone" error={pErrors.phone}>
          <input
            value={pForm.phone}
            onChange={(e) => setPField("phone", formatPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            inputMode="tel"
            autoComplete="tel"
            style={inputStyle(pErrors.phone)}
          />
        </Field>
        <Field label="Senha" error={pErrors.password}>
          <div style={{ position: "relative" }}>
            <input
              type={pShowPassword ? "text" : "password"}
              value={pForm.password}
              onChange={(e) => setPField("password", e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              style={inputStyle(pErrors.password)}
            />
            <button
              className="k-hit k-hit-wide"
              type="button"
              aria-label={pShowPassword ? "Ocultar a senha" : "Mostrar a senha"}
              onClick={() => setPShowPassword((s) => !s)}
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
              {pShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Field label="Confirmar senha" error={pErrors.confirm}>
          <div style={{ position: "relative" }}>
            <input
              type={pShowConfirm ? "text" : "password"}
              value={pForm.confirm}
              onChange={(e) => setPField("confirm", e.target.value)}
              placeholder="Repita a senha"
              autoComplete="new-password"
              style={inputStyle(pErrors.confirm)}
            />
            <button
              className="k-hit k-hit-wide"
              type="button"
              aria-label={pShowConfirm ? "Ocultar a confirmação de senha" : "Mostrar a confirmação de senha"}
              onClick={() => setPShowConfirm((s) => !s)}
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
              {pShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <PrimaryButton sticky onClick={() => validateProPersonal() && setScreen("proAddress")}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  );
}
