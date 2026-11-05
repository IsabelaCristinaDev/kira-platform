// Perfil: histórico de pagamentos (atendimentos concluídos) · API: kira-backend (agendamentos e serviços)
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { EmptyState, ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProPhoto } from "../components/ProfessionalCards";
import { useMyAppointments, useProfessionals } from "../hooks/useProfessionals";

// === PERFIL: Histórico de pagamentos ===
export default function ClientPaymentHistoryScreen() {
  const { setScreen } = useSession();
  const appointments = useMyAppointments();
  const professionals = useProfessionals();
  const paid = (appointments.data ?? []).filter((a) => a.status === "concluido");
  // O agendamento não traz o preço: vem do serviço cadastrado no estúdio
  const priceOf = (a) =>
    professionals.data?.find((p) => p.id === a.proId)?.services.find((s) => s.id === a.serviceId)?.price ?? null;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
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
          Histórico de pagamentos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Pagamentos de serviços já concluídos.
        </p>
        {appointments.isLoading ? (
          <SkeletonLoading count={3} />
        ) : appointments.isError ? (
          <ErrorState
            onRetry={appointments.refetch}
            message={errorMessage(appointments.error, "Não foi possível carregar os pagamentos.")}
          />
        ) : paid.length === 0 ? (
          <EmptyState onClear={() => setScreen("clientProfile")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {paid.map((a) => {
              const price = priceOf(a);
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-12)",
                    padding: "var(--space-12) var(--space-14)",
                    borderRadius: "var(--radius-xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <ProPhoto pro={{ name: a.proName, photo: null }} size={40} radius="var(--radius-md)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 600,
                        color: colors.foreground,
                        margin: 0,
                      }}
                    >
                      {a.service}
                    </p>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                        margin: "var(--space-1) 0 0",
                      }}
                    >
                      {a.proName} • {a.date}
                      {a.payment ? ` • ${a.payment}` : ""}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 700,
                      color: colors.primaryText,
                    }}
                  >
                    {price != null ? `R$ ${price.toFixed(2)}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
