// Perfil: privacidade e dados · estático, lê dados do cadastro
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { DemoNotice } from "../../shared/components/demo";
import { Sheet } from "../../shared/components/Sheet";
import { Header, PrimaryButton, ProfileSection, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Dados e privacidade ===
export default function ClientPrivacyDataScreen() {
  const { cForm } = useSignup();
  const { setScreen } = useSession();
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background, position: "relative" }}
    >
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
          Dados e privacidade
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Estes são os dados que a Kira guarda sobre sua conta.
        </p>
        <ProfileSection title="Dados cadastrados">
          {[
            ["Nome", cForm.name || "—"],
            ["E-mail", cForm.email || "—"],
            ["Telefone", cForm.phone || "—"],
            ["Endereço", cForm.street ? `${cForm.street}, ${cForm.city}` : "—"],
            ["Documento de identidade", cForm.docFront ? "Enviado" : "Não enviado"],
          ].map(([label, value], i, arr) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "var(--space-12) var(--space-14)",
                borderBottom: i === arr.length - 1 ? "none" : `1px solid ${colors.border}`,
              }}
            >
              <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                {label}
              </span>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.foreground,
                  textAlign: "right",
                  maxWidth: 180,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => setExporting(true)}>
          <ShieldCheck size={15} /> Solicitar exportação dos meus dados
        </SecondaryButton>
      </div>
      {exporting && (
        <Sheet
          title="Exportar meus dados"
          onClose={() => {
            setExporting(false);
            setNotice(false);
          }}
        >
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: "0 0 var(--space-16)",
            }}
          >
            Você pode pedir uma cópia dos seus dados pessoais, conforme a LGPD. Confirme para solicitar a exportação.
          </p>
          <PrimaryButton onClick={() => setNotice(true)}>Confirmar solicitação</PrimaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </div>
  );
}
