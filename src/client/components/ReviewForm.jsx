// Formulário de avaliação de um atendimento concluído (nota de 1 a 5 e comentário) · API: kira-backend (POST /api/avaliacoes/cliente)
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { api, errorMessage } from "../../shared/api";
import { Field, PrimaryButton, inputStyle } from "../../shared/components/ui";
import { colors, fontBody } from "../../shared/theme";

const ratingLabels = ["Muito ruim", "Ruim", "Regular", "Bom", "Excelente"];
const MAX_COMMENT = 500;

export function ReviewForm({ appointmentId, onCancel }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const send = useMutation({
    mutationFn: () => api.reviews.create({ appointmentId, rating, text }),
    // A nota entra na média do estúdio: atualiza também a lista e o perfil dos profissionais
    onSuccess: () =>
      Promise.all(
        [["reviews"], ["professionals"], ["professional"]].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  });
  return (
    <div
      style={{
        padding: "var(--space-14)",
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
      }}
    >
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-sm)",
          fontWeight: 700,
          color: colors.foreground,
          margin: 0,
        }}
      >
        Como foi o atendimento?
      </p>
      <div
        role="radiogroup"
        aria-label="Nota do atendimento"
        style={{ display: "flex", gap: "var(--space-6)", margin: "var(--space-10) 0 var(--space-4)" }}
      >
        {ratingLabels.map((label, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} de 5: ${label}`}
              onClick={() => setRating(value)}
              style={{ background: "none", border: "none", padding: "var(--space-2)", cursor: "pointer" }}
            >
              <Star size={28} color={colors.accent} fill={value <= rating ? colors.accent : "none"} />
            </button>
          );
        })}
      </div>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          margin: "0 0 var(--space-12)",
          minHeight: "1.2em",
        }}
      >
        {rating ? ratingLabels[rating - 1] : "Toque nas estrelas para dar a nota"}
      </p>
      <Field label="Comentário (opcional)">
        <textarea
          value={text}
          maxLength={MAX_COMMENT}
          rows={3}
          onChange={(e) => setText(e.target.value)}
          placeholder="Conte como foi para ajudar outras clientes"
          style={{ ...inputStyle(false), resize: "vertical" }}
        />
      </Field>
      {send.isError && (
        <p
          role="alert"
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.destructiveText,
            margin: "0 0 var(--space-10)",
          }}
        >
          {errorMessage(send.error, "Não foi possível enviar a avaliação agora.")}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        <PrimaryButton disabled={!rating || send.isPending} onClick={() => send.mutate()}>
          {send.isPending ? "Enviando..." : "Enviar avaliação"}
        </PrimaryButton>
        <button
          type="button"
          onClick={onCancel}
          disabled={send.isPending}
          style={{
            background: "none",
            border: "none",
            padding: "var(--space-6)",
            cursor: "pointer",
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: colors.mutedForeground,
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
