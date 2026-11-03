// Cadastro: foto do documento · FileReader local, sem upload
import { useRef } from "react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { DocUploadBox, Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ClientDocumentScreen() {
  const { cErrors, cForm, handlePhoto, setCErrors, setCField } = useSignup();
  const { setScreen } = useSession();
  const cDocBackRef = useRef(null);
  const cDocFrontRef = useRef(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={4} />
      <Header onBack={() => setScreen("clientLocation")} />
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
          Documento de identidade
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Envie a foto da frente e do verso do seu documento com foto.
        </p>
        <DocUploadBox
          label="Frente do documento"
          value={cForm.docFront}
          error={cErrors.docFront}
          inputRef={cDocFrontRef}
          onChange={(f) => handlePhoto(f, (v) => setCField("docFront", v))}
        />
        <DocUploadBox
          label="Verso do documento"
          value={cForm.docBack}
          error={cErrors.docBack}
          inputRef={cDocBackRef}
          onChange={(f) => handlePhoto(f, (v) => setCField("docBack", v))}
        />
        <p
          style={{
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            textAlign: "center",
            margin: "0 0 var(--space-12)",
          }}
        >
          Aceitamos RG, CNH ou outro documento oficial com foto.
        </p>
        <PrimaryButton
          sticky
          onClick={() => {
            const e = {};
            if (!cForm.docFront) e.docFront = "Adicione a foto da frente do documento";
            if (!cForm.docBack) e.docBack = "Adicione a foto do verso do documento";
            if (Object.keys(e).length > 0) {
              setCErrors(e);
              return;
            }
            setCErrors({});
            setScreen("clientSelfie");
          }}
        >
          Continuar para verificação facial
        </PrimaryButton>
      </div>
    </div>
  );
}
