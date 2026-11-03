// Edição do perfil · react-hook-form + zod · foto via FileReader · sem API: o backend ainda não tem endpoint de edição, os dados ficam só nesta sessão
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Check, CheckCircle2, ChevronRight, ImagePlus, MapPin, User, X } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { profileEditSchema } from "../../shared/schemas/forms";
import { formatPhone } from "../../shared/utils/format";

// === PERFIL: EditProfileScreen ===
// Formulário de edição: cForm segue como fonte dos dados (mesma fonte
// de verdade usada no resto do app) em vez de duplicar estado.
export default function ClientProfileEditScreen() {
  const { cForm, handlePhoto, setCField } = useSignup();
  const { setScreen } = useSession();
  const cFileInputRef = useRef(null);
  const [profileSaveStatus, setProfileSaveStatus] = useState("idle"); // idle | success
  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { name: cForm.name, email: cForm.email, phone: cForm.phone },
    resolver: zodResolver(profileEditSchema),
  });
  const change = (key, value) => {
    setCField(key, value);
    setValue(key, value);
    clearErrors(key);
  };
  // Os campos já foram gravados em cForm a cada mudança; aqui só confirma e volta
  const saveProfileEdit = handleSubmit(() => {
    setProfileSaveStatus("success");
    setTimeout(() => setScreen("clientProfile"), 700);
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
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
          Editar perfil
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Atualize seus dados pessoais.
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
                border: `2px solid ${colors.primary}`,
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
              onClick={() => cFileInputRef.current?.click()}
              aria-label="Trocar foto"
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
              <ImagePlus size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input
            ref={cFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setCField("photo", v))}
          />
        </div>

        <Field label="Nome completo" error={errors.name?.message}>
          <input
            value={cForm.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="Ex.: Maria Almeida"
            style={inputStyle(errors.name?.message)}
          />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <input
            type="email"
            value={cForm.email}
            onChange={(e) => change("email", e.target.value)}
            placeholder="seu@email.com"
            style={inputStyle(errors.email?.message)}
          />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <input
            value={cForm.phone}
            onChange={(e) => change("phone", formatPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            style={inputStyle(errors.phone?.message)}
          />
        </Field>

        <button
          onClick={() => setScreen("clientAddress")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            width: "100%",
            padding: "var(--space-12) var(--space-14)",
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${colors.border}`,
            background: colors.muted,
            marginBottom: "var(--space-18)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <MapPin size={15} color={colors.mutedForeground} />
          <span style={{ flex: 1, fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.foreground }}>
            {cForm.street ? `${cForm.street}, ${cForm.city}` : "Adicionar endereço"}
          </span>
          <ChevronRight size={15} color={colors.mutedForeground} />
        </button>

        {profileSaveStatus === "success" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-6)",
              padding: "var(--space-10) var(--space-14)",
              borderRadius: "var(--radius-lg)",
              background: "hsl(var(--primary-hsl) / 0.08)",
              marginBottom: "var(--space-12)",
            }}
          >
            <CheckCircle2 size={15} color={colors.primary} />
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.primaryText,
                fontWeight: 600,
              }}
            >
              Perfil atualizado!
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--space-10)" }}>
          <div style={{ flex: 1 }}>
            <SecondaryButton onClick={() => setScreen("clientProfile")}>
              <X size={15} /> Cancelar
            </SecondaryButton>
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={saveProfileEdit} disabled={profileSaveStatus === "success"}>
              <Check size={15} /> Salvar
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
