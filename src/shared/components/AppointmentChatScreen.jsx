// Chat do agendamento entre cliente e estúdio (não é o chat com IA), para os dois lados · API: kira-backend (api.messages)
import { Fragment, useEffect, useMemo, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { errorMessage } from "../api";
import { useAppointmentChat } from "../hooks/useAppointmentChat";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";
import { formatTime, groupMessagesByDay } from "../utils/chatMessages";
import { ChatInput } from "./ChatInput";
import { bubbleText, ON_GRADIENT } from "./chatStyles";
import { ErrorState, SkeletonLoading } from "./states";
import { Header } from "./ui";

const small = { fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 };

const Bubble = ({ message: m }) => (
  <div
    style={{
      alignSelf: m.mine ? "flex-end" : "flex-start",
      maxWidth: "80%",
      display: "flex",
      flexDirection: "column",
      alignItems: m.mine ? "flex-end" : "flex-start",
      gap: "var(--space-4)",
    }}
  >
    <div
      style={{
        ...bubbleText,
        padding: "var(--space-12) var(--space-16)",
        borderRadius: m.mine
          ? "var(--radius-4xl) var(--radius-4xl) var(--radius-xs) var(--radius-4xl)"
          : "var(--radius-4xl) var(--radius-4xl) var(--radius-4xl) var(--radius-xs)",
        background: m.mine ? gradientKira : colors.card,
        border: m.mine ? "none" : `1px solid ${colors.border}`,
        color: m.mine ? ON_GRADIENT : colors.foreground,
      }}
    >
      {m.text}
    </div>
    <span style={small}>{formatTime(m.createdAt)}</span>
  </div>
);

function Conversation({ appointment, otherName }) {
  const { messages, send, connected } = useAppointmentChat(appointment.id);
  const list = messages.data;
  const groups = useMemo(() => groupMessagesByDay(list ?? []), [list]);
  const endRef = useRef(null);
  const readOnly = appointment.rawStatus === "CANCELADO";

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [list?.length]);

  if (messages.isLoading) {
    return (
      <div style={{ padding: "0 var(--space-24)" }}>
        <SkeletonLoading count={3} />
      </div>
    );
  }
  if (messages.isError) {
    return (
      <div style={{ padding: "0 var(--space-24)" }}>
        <ErrorState
          onRetry={messages.refetch}
          message={errorMessage(messages.error, "Não foi possível carregar a conversa.")}
        />
      </div>
    );
  }
  return (
    <>
      {connected === false && (
        <p role="status" style={{ ...small, padding: "var(--space-6) var(--space-16)", background: colors.muted }}>
          Reconectando... As mensagens novas podem demorar um pouco.
        </p>
      )}
      <div
        role="log"
        aria-live="polite"
        aria-label={`Conversa com ${otherName}`}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-12)",
          padding: "var(--space-16)",
        }}
      >
        {list.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center", display: "grid", justifyItems: "center", gap: 8 }}>
            <MessageCircle size={28} color={colors.mutedForeground} aria-hidden="true" />
            <p style={small}>Nenhuma mensagem ainda.</p>
          </div>
        )}
        {groups.map((group) => (
          <Fragment key={group.key}>
            <p style={{ ...small, alignSelf: "center" }}>{group.label}</p>
            {group.messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </Fragment>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "var(--space-8) var(--space-16) var(--space-16)" }}>
        {send.isError && (
          <p role="alert" style={{ ...small, color: colors.destructiveText, marginBottom: "var(--space-8)" }}>
            {errorMessage(send.error, "Não foi possível enviar sua mensagem.")}{" "}
            {/* 400 é regra de negócio: repetir não muda a resposta */}
            {send.error?.status !== 400 && (
              <button
                type="button"
                onClick={() => send.mutate(send.variables)}
                style={{
                  ...small,
                  padding: 0,
                  border: "none",
                  background: "none",
                  color: colors.destructiveText,
                  fontWeight: 700,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Tentar de novo
              </button>
            )}
          </p>
        )}
        {readOnly ? (
          <p style={{ ...small, textAlign: "center" }}>
            Este agendamento foi cancelado. A conversa fica só para leitura.
          </p>
        ) : (
          <ChatInput
            onSend={send.mutate}
            disabled={send.isPending}
            maxLength={1000}
            placeholder={`Mensagem para ${otherName}`}
          />
        )}
      </div>
    </>
  );
}

// `appointments` é a consulta da lista (cliente ou estúdio); `otherNameOf` diz com quem é a conversa
export function AppointmentChatScreen({ appointments, appointmentId, otherNameOf, onBack, onNotFound }) {
  const appointment = appointments.data?.find((a) => a.id === appointmentId);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 780,
        maxHeight: "100dvh",
        background: colors.background,
      }}
    >
      <Header onBack={onBack} />
      {appointment ? (
        <>
          <div style={{ padding: "0 var(--space-24) var(--space-8)", borderBottom: `1px solid ${colors.border}` }}>
            <h1
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-xl)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              {otherNameOf(appointment)}
            </h1>
            <p style={small}>
              {appointment.service} · {appointment.start.toLocaleDateString("pt-BR")}, {appointment.time}
            </p>
          </div>
          <Conversation appointment={appointment} otherName={otherNameOf(appointment)} />
        </>
      ) : (
        <div style={{ padding: "0 var(--space-24) var(--space-32)" }}>
          {appointments.isLoading ? (
            <SkeletonLoading count={2} />
          ) : (
            <ErrorState
              onRetry={appointments.isError ? appointments.refetch : onNotFound}
              message={
                appointments.isError
                  ? errorMessage(appointments.error, "Não foi possível carregar o agendamento.")
                  : "Agendamento não encontrado."
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
