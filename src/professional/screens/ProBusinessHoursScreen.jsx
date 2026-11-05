// Horário de funcionamento: dias e horas em que o estúdio atende · API: kira-backend (GET/PUT /api/empresas/{id}/disponibilidade)
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../../context/SessionContext";
import { api, errorMessage } from "../../shared/api";
import { weekDays } from "../../shared/api/mappers";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton, inputStyle } from "../../shared/components/ui";
import { Card } from "../../shared/components/primitives";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { useBusinessHours } from "../hooks/useBusinessData";

const labelOf = Object.fromEntries(weekDays.map((d) => [d.key, d.label]));

// "HH:mm" se compara como texto
const invalidDay = (d) => d.open && !(d.end > d.start);

const message = (color, role, text) => (
  <p
    role={role}
    style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color, margin: "0 0 var(--space-12)" }}
  >
    {text}
  </p>
);

export default function ProBusinessHoursScreen() {
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const hours = useBusinessHours();
  // Rascunho só existe depois da primeira edição; antes disso a tela mostra o que veio do backend
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const week = draft ?? hours.data;

  const save = useMutation({
    mutationFn: () => api.businessHours.saveMine(week),
    onSuccess: (data) => {
      queryClient.setQueryData(["businessHours"], data);
      setDraft(null);
      setSaved(true);
    },
  });

  const update = (day, patch) => {
    setSaved(false);
    setDraft(week.map((d) => (d.day === day ? { ...d, ...patch } : d)));
  };

  const hasInvalid = week?.some(invalidDay);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
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
          Horário de funcionamento
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Os clientes só conseguem agendar nos dias e horários abertos.
        </p>

        {hours.isLoading && <SkeletonLoading count={3} />}
        {hours.isError && (
          <ErrorState
            onRetry={hours.refetch}
            message={errorMessage(hours.error, "Não foi possível carregar o seu horário.")}
          />
        )}

        {week && (
          <>
            <Card style={{ marginBottom: "var(--space-18)" }}>
              {week.map((d, i) => (
                <div
                  key={d.day}
                  style={{
                    padding: "var(--space-12) var(--space-15)",
                    borderBottom: i === week.length - 1 ? "none" : `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-8)",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-sm)",
                        fontWeight: 600,
                        color: colors.foreground,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={d.open}
                        onChange={(e) => update(d.day, { open: e.target.checked })}
                        style={{ accentColor: "var(--color-primary)", width: 18, height: 18 }}
                      />
                      {labelOf[d.day]}
                    </label>
                    {!d.open && (
                      <span
                        style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                      >
                        Fechado
                      </span>
                    )}
                  </div>
                  {d.open && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-8)",
                        marginTop: "var(--space-8)",
                      }}
                    >
                      <input
                        type="time"
                        aria-label={`${labelOf[d.day]}: abre às`}
                        value={d.start}
                        onChange={(e) => update(d.day, { start: e.target.value })}
                        style={{ ...inputStyle(invalidDay(d)), padding: "var(--space-8) var(--space-10)" }}
                      />
                      <span
                        style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                      >
                        até
                      </span>
                      <input
                        type="time"
                        aria-label={`${labelOf[d.day]}: fecha às`}
                        value={d.end}
                        onChange={(e) => update(d.day, { end: e.target.value })}
                        style={{ ...inputStyle(invalidDay(d)), padding: "var(--space-8) var(--space-10)" }}
                      />
                    </div>
                  )}
                  {invalidDay(d) && (
                    <p
                      role="alert"
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.destructiveText,
                        margin: "var(--space-6) 0 0",
                      }}
                    >
                      O horário de fechar precisa ser depois do de abrir.
                    </p>
                  )}
                </div>
              ))}
            </Card>

            {save.isError &&
              message(colors.destructiveText, "alert", errorMessage(save.error, "Não foi possível salvar agora."))}
            {saved && message(colors.primaryText, "status", "Horário salvo.")}

            <PrimaryButton disabled={!draft || hasInvalid || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Salvando..." : "Salvar horário"}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
