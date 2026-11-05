// Cadastro: foto do documento · FileReader local, sem upload
import { useRef } from "react";
import { useSession } from "../../context/SessionContext";
import { useSignup } from "../../context/SignupContext";
import { DocUploadBox, Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ProDocumentScreen() {
  const { goToFace, setScreen } = useSession();
  const { handlePhoto, pErrors, pForm, setPErrors, setPField } = useSignup();
  const pDocBackRef = useRef(null);
  const pDocFrontRef = useRef(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={4} />
      <Header onBack={() => setScreen("proLocation")} />
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
          value={pForm.docFrontPhoto}
          error={pErrors.docFrontPhoto}
          inputRef={pDocFrontRef}
          onChange={(f) => handlePhoto(f, (v) => setPField("docFrontPhoto", v))}
        />
        <DocUploadBox
          label="Verso do documento"
          value={pForm.docBackPhoto}
          error={pErrors.docBackPhoto}
          inputRef={pDocBackRef}
          onChange={(f) => handlePhoto(f, (v) => setPField("docBackPhoto", v))}
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
            if (!pForm.docFrontPhoto) e.docFrontPhoto = "Adicione a foto da frente do documento";
            if (!pForm.docBackPhoto) e.docBackPhoto = "Adicione a foto do verso do documento";
            if (Object.keys(e).length > 0) {
              setPErrors(e);
              return;
            }
            setPErrors({});
            goToFace("proDocument", "proSpecialties");
          }}
        >
          Continuar para verificação facial
        </PrimaryButton>
      </div>
    </div>
  );
}
