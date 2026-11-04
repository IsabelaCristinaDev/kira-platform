// Cadastro: dados pessoais · validação local · foto via FileReader
import { useRef, useState } from "react";
import { Camera, Eye, EyeOff, User } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { genderOptions } from "../../shared/data/forms";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { formatCpf, formatPhone } from "../../shared/utils/format";

// ---------- Fluxo cliente ----------
export default function ClientPersonalScreen() {
  const { cErrors, cForm, handlePhoto, setCField, validateClientPersonal } = useSignup();
  const { setScreen } = useSession();
  const cFileInputRef = useRef(null);
  const [cShowPassword, setCShowPassword] = useState(false);
  const [cShowConfirm, setCShowConfirm] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={1} />
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
          Cadastro de cliente
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Complete seus dados para agendar com nossos profissionais.
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
                border: `2px ${cForm.photo ? "solid" : "dashed"} ${cErrors.photo ? colors.destructive : cForm.photo ? colors.primary : colors.border}`,
                background: colors.muted,
              }}
            >
              {cForm.photo ? (
                <img
                  src={cForm.photo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={30} color={colors.mutedForeground} />
              )}
            </div>
            <button
              className="k-hit"
              onClick={() => cFileInputRef.current?.click()}
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
            ref={cFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setCField("photo", v))}
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
            onClick={() => cFileInputRef.current?.click()}
          >
            {cForm.photo ? "Trocar foto" : "Enviar foto de perfil"}
          </button>
          {cErrors.photo && (
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
                fontFamily: fontBody,
                margin: 0,
              }}
            >
              {cErrors.photo}
            </p>
          )}
        </div>

        <Field label="Nome completo" error={cErrors.name}>
          <input
            value={cForm.name}
            onChange={(e) => setCField("name", e.target.value)}
            placeholder="Ex.: Maria Almeida"
            autoComplete="name"
            style={inputStyle(cErrors.name)}
          />
        </Field>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0 var(--space-10)",
          }}
        >
          <Field label="CPF" error={cErrors.cpf}>
            <input
              value={cForm.cpf}
              onChange={(e) => setCField("cpf", formatCpf(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              style={inputStyle(cErrors.cpf)}
            />
          </Field>
          <Field label="Nascimento" error={cErrors.birth}>
            <input
              type="date"
              value={cForm.birth}
              onChange={(e) => setCField("birth", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={inputStyle(cErrors.birth)}
            />
          </Field>
        </div>
        <Field label="Sexo" error={cErrors.gender}>
          <select
            value={cForm.gender}
            onChange={(e) => setCField("gender", e.target.value)}
            style={inputStyle(cErrors.gender)}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {genderOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="E-mail" error={cErrors.email}>
          <input
            type="email"
            value={cForm.email}
            onChange={(e) => setCField("email", e.target.value)}
            placeholder="seu@email.com"
            inputMode="email"
            autoComplete="email"
            style={inputStyle(cErrors.email)}
          />
        </Field>
        <Field label="Telefone" error={cErrors.phone}>
          <input
            value={cForm.phone}
            onChange={(e) => setCField("phone", formatPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            inputMode="tel"
            autoComplete="tel"
            style={inputStyle(cErrors.phone)}
          />
        </Field>
        <Field label="Senha" error={cErrors.password}>
          <div style={{ position: "relative" }}>
            <input
              type={cShowPassword ? "text" : "password"}
              value={cForm.password}
              onChange={(e) => setCField("password", e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              style={inputStyle(cErrors.password)}
            />
            <button
              className="k-hit k-hit-wide"
              type="button"
              aria-label={cShowPassword ? "Ocultar a senha" : "Mostrar a senha"}
              onClick={() => setCShowPassword((s) => !s)}
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
              {cShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Field label="Confirmar senha" error={cErrors.confirm}>
          <div style={{ position: "relative" }}>
            <input
              type={cShowConfirm ? "text" : "password"}
              value={cForm.confirm}
              onChange={(e) => setCField("confirm", e.target.value)}
              placeholder="Repita a senha"
              autoComplete="new-password"
              style={inputStyle(cErrors.confirm)}
            />
            <button
              className="k-hit k-hit-wide"
              type="button"
              aria-label={cShowConfirm ? "Ocultar a confirmação de senha" : "Mostrar a confirmação de senha"}
              onClick={() => setCShowConfirm((s) => !s)}
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
              {cShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <PrimaryButton sticky onClick={() => validateClientPersonal() && setScreen("clientAddress")}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  );
}
