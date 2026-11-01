// Pix do agendamento: código para copiar, aviso de pagamento e acompanhamento da conferência · API: api.bookings
import { Copy, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PAYMENT_STATES } from "../../../shared/api/bookingContract";
import { PrimaryButton, SecondaryButton } from "../../../shared/components/ui";
import { colors, fontBody } from "../../../shared/theme";

const text = { margin: 0, fontFamily: fontBody };

export const PaymentPanel = ({ payment, paying, error, onReport }) => {
  const [copied, setCopied] = useState(false);
  const review = payment.state === PAYMENT_STATES.REVIEW;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payment.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Pagamento por Pix"
      style={{
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
        padding: "var(--space-16)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-10)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <p style={{ ...text, fontSize: "var(--font-size-sm)", fontWeight: 700, color: colors.foreground }}>
          Pagar com Pix
        </p>
        <p style={{ ...text, fontSize: "var(--font-size-base)", fontWeight: 700, color: colors.foreground }}>
          R$ {payment.amount.toFixed(2).replace(".", ",")}
        </p>
      </div>
      {review ? (
        <p role="status" style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
          Recebemos o seu aviso e estamos conferindo o pagamento. Avisamos aqui assim que for confirmado.
        </p>
      ) : (
        <>
          <p style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            Copie o código, pague no app do seu banco e depois toque em &ldquo;Já fiz o pagamento&rdquo;.
          </p>
          <code
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              padding: "var(--space-10) var(--space-12)",
              borderRadius: "var(--radius-lg)",
              background: colors.muted,
              color: colors.foreground,
              wordBreak: "break-all",
            }}
          >
            {payment.pixCode}
          </code>
          <SecondaryButton onClick={copy}>
            <Copy size={15} aria-hidden="true" /> {copied ? "Código copiado" : "Copiar código"}
          </SecondaryButton>
          <PrimaryButton onClick={onReport} disabled={paying}>
            {paying ? "Enviando aviso..." : "Já fiz o pagamento"}
          </PrimaryButton>
          {error && (
            <p role="alert" style={{ ...text, fontSize: "var(--font-size-xs)", color: colors.primaryText }}>
              Não foi possível enviar o aviso agora. Tente de novo em instantes.
            </p>
          )}
        </>
      )}
      <p
        style={{
          ...text,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          display: "flex",
          gap: "var(--space-6)",
          alignItems: "center",
        }}
      >
        <ShieldCheck size={14} aria-hidden="true" /> O pagamento é conferido pela equipe da Kira.
      </p>
    </section>
  );
};
