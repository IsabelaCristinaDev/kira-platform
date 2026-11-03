// Cadastro: endereço · CEP pelo ViaCEP
import { Loader2 } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { formatCep } from "../../shared/utils/format";
import { useCepLookup } from "../../shared/hooks/useCepLookup";

export default function ClientAddressScreen() {
  const { cErrors, cForm, setCErrors, setCField, setCForm, validateAddress } = useSignup();
  const { setScreen } = useSession();
  const { cepLoading: cCepLoading, handleCepBlur } = useCepLookup(setCForm);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={2} />
      <Header onBack={() => setScreen("clientPersonal")} />
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
          Endereço
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Onde você quer receber os profissionais?
        </p>
        <Field label="CEP" error={cErrors.cep}>
          <div style={{ position: "relative" }}>
            <input
              value={cForm.cep}
              onChange={(e) => setCField("cep", formatCep(e.target.value))}
              onBlur={() => handleCepBlur(cForm)}
              placeholder="00000-000"
              style={inputStyle(cErrors.cep)}
            />
            {cCepLoading && (
              <Loader2
                size={16}
                color={colors.mutedForeground}
                className="spin"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
              />
            )}
          </div>
        </Field>
        <Field label="Rua" error={cErrors.street}>
          <input
            value={cForm.street}
            onChange={(e) => setCField("street", e.target.value)}
            placeholder="Ex.: Av. T-4"
            style={inputStyle(cErrors.street)}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }}>
          <Field label="Número" error={cErrors.number}>
            <input
              value={cForm.number}
              onChange={(e) => setCField("number", e.target.value)}
              placeholder="Ex.: 123"
              style={inputStyle(cErrors.number)}
            />
          </Field>
          <Field label="Complemento">
            <input
              value={cForm.complement}
              onChange={(e) => setCField("complement", e.target.value)}
              placeholder="Ap., bloco..."
              style={inputStyle(false)}
            />
          </Field>
        </div>
        <Field label="Bairro" error={cErrors.neighborhood}>
          <input
            value={cForm.neighborhood}
            onChange={(e) => setCField("neighborhood", e.target.value)}
            placeholder="Ex.: Setor Bueno"
            style={inputStyle(cErrors.neighborhood)}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }}>
          <Field label="Cidade" error={cErrors.city}>
            <input
              value={cForm.city}
              onChange={(e) => setCField("city", e.target.value)}
              placeholder="Ex.: Goiânia"
              style={inputStyle(cErrors.city)}
            />
          </Field>
          <Field label="Estado" error={cErrors.state}>
            <input
              value={cForm.state}
              onChange={(e) => setCField("state", e.target.value.toUpperCase())}
              placeholder="Ex.: GO"
              maxLength={2}
              style={inputStyle(cErrors.state)}
            />
          </Field>
        </div>
        <PrimaryButton onClick={() => validateAddress(cForm, setCErrors) && setScreen("clientLocation")}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  );
}
