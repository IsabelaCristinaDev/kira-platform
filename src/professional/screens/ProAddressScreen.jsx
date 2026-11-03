// Cadastro: endereço · CEP pelo ViaCEP
import { Loader2 } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Field, Header, PrimaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { formatCep } from "../../shared/utils/format";
import { useCepLookup } from "../../shared/hooks/useCepLookup";

export default function ProAddressScreen() {
  const { pErrors, pForm, setPErrors, setPField, setPForm, validateAddress } = useSignup();
  const { setScreen } = useSession();
  const { cepLoading: pCepLoading, handleCepBlur } = useCepLookup(setPForm);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={2} />
      <Header onBack={() => setScreen("proPersonal")} />
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
          Onde fica o seu local de atendimento?
        </p>
        <Field label="CEP" error={pErrors.cep}>
          <div style={{ position: "relative" }}>
            <input
              value={pForm.cep}
              onChange={(e) => setPField("cep", formatCep(e.target.value))}
              onBlur={() => handleCepBlur(pForm)}
              placeholder="00000-000"
              style={inputStyle(pErrors.cep)}
            />
            {pCepLoading && (
              <Loader2
                size={16}
                color={colors.mutedForeground}
                className="spin"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
              />
            )}
          </div>
        </Field>
        <Field label="Rua" error={pErrors.street}>
          <input
            value={pForm.street}
            onChange={(e) => setPField("street", e.target.value)}
            placeholder="Ex.: Av. T-4"
            style={inputStyle(pErrors.street)}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }}>
          <Field label="Número" error={pErrors.number}>
            <input
              value={pForm.number}
              onChange={(e) => setPField("number", e.target.value)}
              placeholder="Ex.: 123"
              style={inputStyle(pErrors.number)}
            />
          </Field>
          <Field label="Complemento">
            <input
              value={pForm.complement}
              onChange={(e) => setPField("complement", e.target.value)}
              placeholder="Sala, loja..."
              style={inputStyle(false)}
            />
          </Field>
        </div>
        <Field label="Bairro" error={pErrors.neighborhood}>
          <input
            value={pForm.neighborhood}
            onChange={(e) => setPField("neighborhood", e.target.value)}
            placeholder="Ex.: Setor Bueno"
            style={inputStyle(pErrors.neighborhood)}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }}>
          <Field label="Cidade" error={pErrors.city}>
            <input
              value={pForm.city}
              onChange={(e) => setPField("city", e.target.value)}
              placeholder="Ex.: Goiânia"
              style={inputStyle(pErrors.city)}
            />
          </Field>
          <Field label="Estado" error={pErrors.state}>
            <input
              value={pForm.state}
              onChange={(e) => setPField("state", e.target.value.toUpperCase())}
              placeholder="Ex.: GO"
              maxLength={2}
              style={inputStyle(pErrors.state)}
            />
          </Field>
        </div>
        <PrimaryButton onClick={() => validateAddress(pForm, setPErrors) && setScreen("proLocation")}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  );
}
