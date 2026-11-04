// Detalhe do agendamento + botão de segurança · mock · denúncia: futura POST /api/denuncias
import { MessageCircle, Route, XCircle } from "lucide-react";
import { useState } from "react";
import { useConversations } from "../../context/ConversationsContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoNotice } from "../../shared/components/demo";
import { ReportButton } from "../../shared/components/Safety";
import { Sheet } from "../../shared/components/Sheet";
import { StarRatingInput } from "../../shared/components/StarRatingInput";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody } from "../../shared/theme";
import { appointmentsMock } from "../data/mocks";

export default function ClientAgendaDetailScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointment = appointmentsMock.find((a) => a.id === selectedAppointmentId) || appointmentsMock[0];
  const pro = mockProfessionals.find((p) => p.id === appointment.proId) || mockProfessionals[0];
  const canCancel = appointment.status === "proximo";
  const { setSelectedConversationId } = useConversations();
  const [sheet, setSheet] = useState(null); // "review" | "cancel" | null
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState(false);
  const closeSheet = () => {
    setSheet(null);
    setNotice(false);
  };
  const openChat = () => {
    setSelectedConversationId(`pro-${appointment.proId}`);
    setScreen("clientConversation");
  };
  const summary = (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        border: `1px solid ${colors.border}`,
        padding: "var(--space-12) var(--space-14)",
        marginBottom: "var(--space-16)",
        fontFamily: fontBody,
        fontSize: "var(--font-size-xs)",
        color: colors.foreground,
        lineHeight: 1.5,
      }}
    >
      <strong>{appointment.service}</strong> com {pro.name}
      <br />
      {appointment.date} às {appointment.time}
    </div>
  );
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background, position: "relative" }}
    >
      <Header onBack={() => setScreen("clientAgenda")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", marginBottom: "var(--space-18)" }}>
          <img
            src={pro.photo}
            alt={pro.name}
            style={{ width: 60, height: 60, borderRadius: "var(--radius-2xl)", objectFit: "cover" }}
          />
          <div>
            <p
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              {pro.name}
            </p>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              {pro.role}
            </p>
          </div>
        </div>

        <div
          style={{
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: "var(--space-16)",
            marginBottom: "var(--space-18)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-10)",
          }}
        >
          {[
            ["Serviço", appointment.service],
            ["Data", appointment.date],
            ["Horário", appointment.time],
            ["Endereço", appointment.place],
            ["Preço", `R$ ${appointment.price.toFixed(2)}`],
            ["Pagamento", appointment.payment],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                {label}
              </span>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.foreground,
                }}
              >
                {value}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "var(--space-8)",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              Status
            </span>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
                color: appointment.status === "cancelado" ? colors.destructiveText : colors.primaryText,
              }}
            >
              {appointment.status === "proximo"
                ? "✓ Confirmado"
                : appointment.status === "concluido"
                  ? "Concluído"
                  : "Cancelado"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
          {canCancel && (
            <PrimaryButton onClick={() => setScreen("clientBookingTracking")}>
              <Route size={15} aria-hidden="true" /> Acompanhar agendamento
            </PrimaryButton>
          )}
          <SecondaryButton onClick={() => setScreen("clientJourney")}>Ver jornada</SecondaryButton>
          <SecondaryButton onClick={openChat}>
            <MessageCircle size={15} /> Conversar com {pro.name.split(" ")[0]}
          </SecondaryButton>
          {appointment.status === "concluido" && !appointment.rated && (
            <PrimaryButton onClick={() => setSheet("review")}>Avaliar atendimento</PrimaryButton>
          )}
          {canCancel && (
            <button
              type="button"
              className="k-hit"
              onClick={() => setSheet("cancel")}
              style={{
                width: "100%",
                padding: "var(--space-12)",
                minHeight: 44,
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "transparent",
                color: colors.destructiveText,
                fontWeight: 600,
                fontSize: "var(--font-size-sm)",
                fontFamily: fontBody,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-6)",
              }}
            >
              <XCircle size={15} /> Cancelar agendamento
            </button>
          )}
          <ReportButton agendamentoId={appointment.id} papel="CLIENTE" />
        </div>
      </div>
      {sheet === "review" && (
        <Sheet title="Avaliar atendimento" onClose={closeSheet}>
          {summary}
          <StarRatingInput value={stars} onChange={setStars} label="Sua nota" />
          <label
            htmlFor="review-comment"
            style={{
              display: "block",
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 600,
              color: colors.foreground,
              margin: "var(--space-14) 0 var(--space-6)",
            }}
          >
            Comentário (opcional)
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Conte como foi o atendimento"
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "none",
              padding: "var(--space-12)",
              borderRadius: "var(--radius-lg)",
              border: `1px solid ${colors.border}`,
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              background: colors.background,
              marginBottom: "var(--space-14)",
            }}
          />
          <PrimaryButton disabled={stars === 0} onClick={() => setNotice(true)}>
            Enviar avaliação
          </PrimaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
      {sheet === "cancel" && (
        <Sheet title="Cancelar agendamento" onClose={closeSheet}>
          {summary}
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: "0 0 var(--space-16)",
            }}
          >
            Tem certeza de que deseja cancelar este agendamento?
          </p>
          <button
            type="button"
            onClick={() => setNotice(true)}
            style={{
              width: "100%",
              minHeight: 44,
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: colors.destructive,
              color: colors.primaryForeground,
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-sm)",
              cursor: "pointer",
              marginBottom: "var(--space-8)",
            }}
          >
            Confirmar cancelamento
          </button>
          <SecondaryButton onClick={closeSheet}>Manter agendamento</SecondaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </div>
  );
}
