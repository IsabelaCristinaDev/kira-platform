// Painel: métricas, receita da semana e próximos atendimentos · API: kira-backend (agendamentos, serviços e avaliações)
import { useState } from "react";
import { ChevronRight, Clock, CreditCard, ShieldCheck, Sparkles, Star, User } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { useSignup } from "../../context/SignupContext";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { ProStatCard, RevenueBarChart } from "../components/ProWidgets";
import { useBusinessData, useBusinessHours } from "../hooks/useBusinessData";
import { appointmentsOn, averageRating, revenueDelta, upcoming, weeklyRevenue } from "../utils/metrics";

// "Meu painel" — visão geral do profissional: estatísticas do dia,
// faturamento semanal (gráfico) e próximos atendimentos, como no folheto.
export default function ProHomeScreen() {
  const { auth, goToProTab, setScreen } = useSession();
  const { pForm } = useSignup();
  const [proHomeRevenueSel, setProHomeRevenueSel] = useState(null);
  const business = useBusinessData();
  const proWeeklyRevenue = weeklyRevenue(business.appointments);
  const weekTotal = proWeeklyRevenue.reduce((s, d) => s + d.value, 0);
  const delta = revenueDelta(business.appointments);
  const rating = averageRating(business.reviews);
  const nextAppointments = upcoming(business.appointments);
  const displayName = auth?.nome || pForm.name;
  const businessHours = useBusinessHours();
  const noBusinessHours = businessHours.data?.every((d) => !d.open) ?? false;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "var(--space-20) var(--space-24) var(--space-4)" }}>
        <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}>
          Olá,
        </p>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-2) 0 var(--space-18)",
          }}
        >
          {displayName ? displayName.split(" ")[0] : "Profissional"}{" "}
          <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", color: colors.primaryText }} />
        </h1>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--space-24) var(--space-24)" }}>
        {business.error && (
          <ErrorState
            onRetry={business.retry}
            message={errorMessage(business.error, "Não foi possível carregar o painel.")}
          />
        )}
        {noBusinessHours && (
          <button
            type="button"
            onClick={() => setScreen("proBusinessHours")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-12)",
              textAlign: "left",
              border: `1px solid ${colors.primary}`,
              borderRadius: "var(--radius-2xl)",
              background: colors.card,
              padding: "var(--space-14) var(--space-16)",
              marginBottom: "var(--space-18)",
              cursor: "pointer",
              fontFamily: fontBody,
            }}
          >
            <Clock size={20} style={{ color: colors.primaryText, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>
              <span
                style={{ display: "block", fontSize: "var(--font-size-sm)", fontWeight: 700, color: colors.foreground }}
              >
                Defina seu horário de funcionamento
              </span>
              <span style={{ display: "block", fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                Sem dias abertos, os clientes não conseguem agendar com você.
              </span>
            </span>
            <ChevronRight size={16} style={{ color: colors.mutedForeground, flexShrink: 0 }} />
          </button>
        )}
        {business.loading ? (
          <SkeletonLoading count={3} />
        ) : (
          <>
            <div style={{ display: "flex", gap: "var(--space-10)", marginBottom: "var(--space-20)" }}>
              <ProStatCard
                label="Clientes hoje"
                value={appointmentsOn(business.appointments, new Date()).length}
                icon={User}
              />
              <ProStatCard label="Receita" value={`R$ ${weekTotal.toLocaleString("pt-BR")}`} icon={CreditCard} />
              <ProStatCard label="Nota" value={rating ?? "—"} icon={Star} />
            </div>

            <div
              onClick={() => setScreen("proFinance")}
              role="presentation"
              style={{
                width: "100%",
                textAlign: "left",
                border: `1px solid ${colors.border}`,
                borderRadius: "var(--radius-3xl)",
                background: colors.card,
                padding: "var(--space-16)",
                marginBottom: "var(--space-22)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "var(--space-14)",
                }}
              >
                <h2
                  style={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "var(--font-size-base)",
                    color: colors.foreground,
                    margin: 0,
                  }}
                >
                  Faturamento semanal
                </h2>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: colors.primaryText,
                  }}
                >
                  {delta == null ? "" : `${delta >= 0 ? "+" : ""}${delta}%`}
                </span>
              </div>
              <RevenueBarChart
                data={proWeeklyRevenue}
                selectedIndex={proHomeRevenueSel}
                onSelect={(i) => {
                  setProHomeRevenueSel(i);
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "var(--space-12)",
                }}
              >
                <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                  {proHomeRevenueSel !== null
                    ? `${proWeeklyRevenue[proHomeRevenueSel].label} · R$ ${proWeeklyRevenue[proHomeRevenueSel].value.toLocaleString("pt-BR")}`
                    : "Toque em um dia para ver o valor"}
                </span>
                <button
                  type="button"
                  className="k-reset"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScreen("proFinance");
                  }}
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: colors.primaryText,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  Ver gestão financeira <ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-12)",
              }}
            >
              <h2
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: colors.foreground,
                  margin: 0,
                }}
              >
                Próximos atendimentos
              </h2>
              <button
                type="button"
                className="k-reset"
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.primaryText,
                  cursor: "pointer",
                }}
                onClick={() => setScreen("proAgendaDash")}
              >
                Ver agenda
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-10)",
                marginBottom: "var(--space-22)",
              }}
            >
              {nextAppointments.length === 0 && (
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: 0,
                  }}
                >
                  Nenhum atendimento agendado.
                </p>
              )}
              {nextAppointments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-12)",
                    padding: "var(--space-12)",
                    borderRadius: "var(--radius-2xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-lg)",
                      background: colors.muted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={17} color={colors.mutedForeground} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontWeight: 700,
                        fontSize: "var(--font-size-sm)",
                        color: colors.foreground,
                        margin: 0,
                      }}
                    >
                      {a.clientName}
                    </p>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                        margin: "var(--space-1) 0 0",
                      }}
                    >
                      {a.date} · {a.time} · {a.service}
                    </p>
                  </div>
                  <ChevronRight size={16} color={colors.mutedForeground} />
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setScreen("proSecurity")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-12)",
            padding: "var(--space-14)",
            borderRadius: "var(--radius-2xl)",
            border: "none",
            background: "hsl(var(--primary-hsl) / 0.08)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-lg)",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={18} color={colors.primaryForeground} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "var(--font-size-sm)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              Perfil verificado
            </p>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: "var(--space-1) 0 0",
              }}
            >
              Veja seu selo de confiança e segurança
            </p>
          </div>
          <ChevronRight size={18} color={colors.primary} />
        </button>
      </div>
      <ProBottomNav active="proHome" onNavigate={goToProTab} />
    </div>
  );
}
