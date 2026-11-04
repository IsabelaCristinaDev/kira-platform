// Checkout do agendamento: resumo e escolha do pagamento (Pix, cartão, Gift Card) · demonstração, nada é cobrado nem validado
import { Check, CreditCard, Gift, QrCode } from "lucide-react";
import { useState } from "react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoBanner, DemoNotice } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { inputStyle, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { cardsDemo } from "../../shared/data/demo";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

const METHODS = [
  { id: "pix", label: "Pix", detail: "Código para pagar no app do banco", icon: QrCode },
  { id: "card", label: "Cartão de crédito", detail: "Em até 3x", icon: CreditCard },
  { id: "gift", label: "Gift Card Kira", detail: "Use o código do seu Gift Card", icon: Gift },
];

const text = { margin: 0, fontFamily: fontBody };

export default function ClientCheckoutScreen() {
  const { selectedProId, selectedDate, bookedSlot, scheduleTime } = useScheduling();
  const { setScreen } = useSession();
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  const [method, setMethod] = useState("pix");
  const [cardId, setCardId] = useState(cardsDemo[0].id);
  const [installments, setInstallments] = useState(1);
  const [giftCode, setGiftCode] = useState("");
  const [notice, setNotice] = useState("");
  const time = bookedSlot || scheduleTime;
  const date = selectedDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  return (
    <ScreenFrame
      onBack={() => setScreen("clientScheduling")}
      title="Pagamento"
      subtitle="Escolha como pagar o seu agendamento."
    >
      <DemoBanner>Tela de demonstração: nenhum pagamento é processado e nenhum valor é cobrado.</DemoBanner>

      <section
        aria-label="Resumo do agendamento"
        style={{
          display: "flex",
          gap: "var(--space-12)",
          alignItems: "center",
          padding: "var(--space-14)",
          borderRadius: "var(--radius-2xl)",
          border: `1px solid ${colors.border}`,
          background: colors.card,
          marginBottom: "var(--space-18)",
        }}
      >
        <img
          src={pro.photo}
          alt=""
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-xl)",
            objectFit: "cover",
            objectPosition: "center 25%",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              ...text,
              fontWeight: 700,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              overflowWrap: "anywhere",
            }}
          >
            {pro.name}
          </p>
          <p style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>{pro.services[0]}</p>
          <p style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            {date ? `${date} às ${time ?? "--:--"}` : "Data e horário ainda não escolhidos"}
          </p>
        </div>
        <p style={{ ...text, fontWeight: 700, fontSize: "var(--font-size-base)", color: colors.primaryText }}>
          R$ {pro.price}
        </p>
      </section>

      <div
        role="radiogroup"
        aria-label="Método de pagamento"
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-16)" }}
      >
        {METHODS.map(({ id, label, detail, icon: Icon }) => {
          const on = method === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setMethod(id);
                setNotice("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-12)",
                minHeight: 56,
                padding: "var(--space-12) var(--space-14)",
                borderRadius: "var(--radius-2xl)",
                border: `2px solid ${on ? colors.primary : colors.border}`,
                background: colors.card,
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-lg)",
                  background: colors.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={colors.primaryText} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    ...text,
                    display: "block",
                    fontWeight: 700,
                    fontSize: "var(--font-size-sm)",
                    color: colors.foreground,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{ ...text, display: "block", fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                >
                  {detail}
                </span>
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "var(--radius-round)",
                  border: `2px solid ${on ? colors.primary : colors.border}`,
                  background: on ? colors.primary : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {on && <Check size={13} color={colors.primaryForeground} />}
              </span>
            </button>
          );
        })}
      </div>

      {method === "pix" && (
        <section
          aria-label="Pagamento por Pix"
          style={{
            padding: "var(--space-16)",
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            marginBottom: "var(--space-16)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-10)",
          }}
        >
          <div
            role="img"
            aria-label="QR Code de exemplo, não é um código real"
            style={{
              width: 148,
              height: 148,
              borderRadius: "var(--radius-lg)",
              border: `2px dashed ${colors.border}`,
              background: colors.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            <QrCode size={56} color={colors.mutedForeground} aria-hidden="true" />
            <span style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              QR Code de exemplo
            </span>
          </div>
          <code
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              padding: "var(--space-10) var(--space-12)",
              borderRadius: "var(--radius-lg)",
              background: colors.muted,
              color: colors.foreground,
              wordBreak: "break-all",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            CÓDIGO-PIX-DE-EXEMPLO
          </code>
          <SecondaryButton disabled onClick={() => {}}>
            Copiar código (indisponível na demonstração)
          </SecondaryButton>
        </section>
      )}

      {method === "card" && (
        <section aria-label="Pagamento com cartão" style={{ marginBottom: "var(--space-16)" }}>
          <div
            role="radiogroup"
            aria-label="Cartão"
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-12)" }}
          >
            {cardsDemo.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={cardId === c.id}
                onClick={() => setCardId(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-10)",
                  minHeight: 48,
                  padding: "var(--space-10) var(--space-14)",
                  borderRadius: "var(--radius-xl)",
                  border: `2px solid ${cardId === c.id ? colors.primary : colors.border}`,
                  background: colors.card,
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-sm)",
                  color: colors.foreground,
                  boxSizing: "border-box",
                }}
              >
                <CreditCard size={16} aria-hidden="true" /> {c.label} •••• {c.last4}
              </button>
            ))}
          </div>
          <label
            htmlFor="installments"
            style={{
              ...text,
              display: "block",
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: colors.foreground,
              marginBottom: "var(--space-4)",
            }}
          >
            Parcelamento
          </label>
          <select
            id="installments"
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            style={inputStyle(false)}
          >
            <option value={1}>À vista</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
          <p
            style={{
              ...text,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              marginTop: "var(--space-6)",
            }}
          >
            Parcelamento em até 3x. Condições e juros a definir.
          </p>
        </section>
      )}

      {method === "gift" && (
        <section aria-label="Pagamento com Gift Card" style={{ marginBottom: "var(--space-16)" }}>
          <label
            htmlFor="gift-code"
            style={{
              ...text,
              display: "block",
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: colors.foreground,
              marginBottom: "var(--space-4)",
            }}
          >
            Código do Gift Card
          </label>
          <div style={{ display: "flex", gap: "var(--space-8)" }}>
            <input
              id="gift-code"
              value={giftCode}
              onChange={(e) => {
                setGiftCode(e.target.value);
                setNotice("");
              }}
              autoComplete="off"
              style={{ ...inputStyle(false), flex: 1, minWidth: 0 }}
            />
            <SecondaryButton onClick={() => setNotice("gift")}>Aplicar</SecondaryButton>
          </div>
          <DemoNotice show={notice === "gift"} />
        </section>
      )}

      <section
        aria-label="Resumo final"
        style={{
          padding: "var(--space-14)",
          borderRadius: "var(--radius-2xl)",
          background: colors.muted,
          marginBottom: "var(--space-16)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
          }}
        >
          <span>{pro.services[0]}</span>
          <span>R$ {pro.price}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
          }}
        >
          <span>Taxas</span>
          <span>Não informadas</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
          }}
        >
          <span>Total</span>
          <span>R$ {pro.price}</span>
        </div>
      </section>

      <PrimaryButton onClick={() => setScreen("clientPaymentProcessing")}>
        Confirmar pagamento (demonstração)
      </PrimaryButton>
    </ScreenFrame>
  );
}
