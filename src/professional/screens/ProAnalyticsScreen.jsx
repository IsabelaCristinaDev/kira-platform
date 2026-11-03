// Analytics: serviços mais agendados, avaliações e retorno · API: kira-backend (agendamentos, serviços e avaliações)
import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, CreditCard, Star, TrendingUp, User, X } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";
import { ProStatCard, RevenueBarChart } from "../components/ProWidgets";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { useBusinessData } from "../hooks/useBusinessData";
import {
  analyticsSummary,
  appointmentsByWeekday,
  ratingBreakdown,
  serviceClientBreakdown,
  serviceRanking,
} from "../utils/metrics";
import { EscapeKey } from "../../shared/components/primitives";

// "Analytics" — painel de desempenho do profissional: atendimentos por
// dia, serviços mais procurados, distribuição de avaliações e métricas
// de conversão/retorno de clientes.
export default function ProAnalyticsScreen() {
  const { goToProTab } = useSession();
  const [proAnalyticsSel, setProAnalyticsSel] = useState(null);
  const [proServiceDetail, setProServiceDetail] = useState(null);
  // Com o painel de detalhes aberto, trava a rolagem da página por trás dele
  useEffect(() => {
    document.body.style.overflow = proServiceDetail ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [proServiceDetail]);
  const business = useBusinessData();
  const proAnalyticsSummary = analyticsSummary(business.appointments);
  const proAppointmentsWeek = appointmentsByWeekday(business.appointments);
  const proServiceRanking = serviceRanking(business.appointments);
  const proRatingBreakdown = ratingBreakdown(business.reviews);
  const maxServiceCount = Math.max(1, ...proServiceRanking.map((s) => s.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "var(--space-20) var(--space-24) var(--space-4)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Analytics
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-4)",
          }}
        >
          Desempenho do seu perfil profissional na Kira.
        </p>
      </div>
      <div style={{ flex: 1, padding: "var(--space-8) var(--space-24) var(--space-24)", overflowY: "auto" }}>
        {business.loading ? (
          <SkeletonLoading count={3} />
        ) : business.error ? (
          <ErrorState
            onRetry={business.retry}
            message={errorMessage(business.error, "Não foi possível carregar o analytics.")}
          />
        ) : (
          <>
            <div style={{ display: "flex", gap: "var(--space-10)", marginBottom: "var(--space-20)" }}>
              <ProStatCard label="Ticket médio" value={`R$ ${proAnalyticsSummary.avgTicket}`} icon={CreditCard} />
              <ProStatCard
                label="Retorno de clientes"
                value={`${proAnalyticsSummary.retentionRate}%`}
                icon={TrendingUp}
              />
              <ProStatCard label="Conclusão" value={`${proAnalyticsSummary.completionRate}%`} icon={CheckCircle2} />
            </div>

            <div
              style={{
                borderRadius: "var(--radius-3xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
                padding: "var(--space-16)",
                marginBottom: "var(--space-20)",
              }}
            >
              <h2
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: colors.foreground,
                  margin: "0 0 var(--space-14)",
                }}
              >
                Atendimentos por dia
              </h2>
              <RevenueBarChart
                data={proAppointmentsWeek}
                selectedIndex={proAnalyticsSel}
                onSelect={setProAnalyticsSel}
              />
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: "var(--space-12) 0 0",
                }}
              >
                {proAnalyticsSel !== null
                  ? `${proAppointmentsWeek[proAnalyticsSel].label} · ${proAppointmentsWeek[proAnalyticsSel].value} atendimento(s) concluído(s)`
                  : "Atendimentos concluídos por dia da semana. Toque em um dia para ver o total"}
              </p>
            </div>

            <h2
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: "0 0 var(--space-10)",
              }}
            >
              Serviços mais procurados
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-10)",
                marginBottom: "var(--space-20)",
              }}
            >
              {proServiceRanking.length === 0 && (
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: 0,
                  }}
                >
                  Nenhum atendimento concluído ainda.
                </p>
              )}
              {proServiceRanking.map((s) => (
                <button
                  key={s.service}
                  onClick={() => setProServiceDetail(s)}
                  style={{
                    padding: "var(--space-12) var(--space-14)",
                    borderRadius: "var(--radius-xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-8)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 700,
                        color: colors.foreground,
                      }}
                    >
                      {s.service}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-4)",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                      }}
                    >
                      {s.count}x · R$ {s.revenue} <ChevronRight size={13} color={colors.mutedForeground} />
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 6,
                      borderRadius: "var(--radius-pill)",
                      background: colors.muted,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(s.count / maxServiceCount) * 100}%`,
                        height: "100%",
                        borderRadius: "var(--radius-pill)",
                        background: gradientKira,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <h2
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: "0 0 var(--space-10)",
              }}
            >
              Distribuição de avaliações
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              {proRatingBreakdown.map((r) => (
                <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      color: colors.foreground,
                      width: 34,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    {r.stars} <Star size={11} color={colors.primary} fill={colors.primary} />
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: "var(--radius-pill)",
                      background: colors.muted,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.percent}%`,
                        height: "100%",
                        borderRadius: "var(--radius-pill)",
                        background: gradientKira,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      width: 32,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {r.percent}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ProBottomNav active="proAnalytics" onNavigate={goToProTab} />

      {proServiceDetail &&
        (() => {
          const clients = serviceClientBreakdown(proServiceDetail);
          const uniqueClients = clients.length;
          return (
            <div
              role="presentation"
              onClick={(e) => e.target === e.currentTarget && setProServiceDetail(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "hsl(var(--foreground-hsl) / 0.45)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                zIndex: 60,
              }}
            >
              <EscapeKey onEscape={() => setProServiceDetail(null)} />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Detalhes do serviço"
                style={{
                  width: "100%",
                  maxWidth: 380,
                  maxHeight: "78%",
                  margin: "0 auto",
                  background: colors.card,
                  borderRadius: "var(--radius-sheet)",
                  padding: "var(--space-20) var(--space-24) var(--space-28)",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: "var(--radius-2xs)",
                    background: colors.border,
                    margin: "0 auto var(--space-16)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: fontDisplay,
                      fontWeight: 700,
                      fontSize: "var(--font-size-lg)",
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {proServiceDetail.service}
                  </h2>
                  <button
                    onClick={() => setProServiceDetail(null)}
                    aria-label="Fechar"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: colors.mutedForeground,
                      padding: 0,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: "0 0 var(--space-16)",
                  }}
                >
                  {proServiceDetail.count} atendimentos · {uniqueClients} cliente{uniqueClients === 1 ? "" : "s"} · R${" "}
                  {proServiceDetail.revenue}
                </p>

                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: colors.mutedForeground,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: "0 0 var(--space-10)",
                  }}
                >
                  Clientes que realizaram este serviço
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                  {clients.map((c) => (
                    <div
                      key={`${c.name}-${c.lastDate}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-12)",
                        padding: "var(--space-10) var(--space-12)",
                        borderRadius: "var(--radius-xl)",
                        border: `1px solid ${colors.border}`,
                        background: colors.background,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "var(--radius-round)",
                          background: colors.muted,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <User size={16} color={colors.mutedForeground} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "var(--font-size-xs)",
                            color: colors.foreground,
                            margin: 0,
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            fontFamily: fontBody,
                            fontSize: "var(--font-size-xs)",
                            color: colors.mutedForeground,
                            margin: "var(--space-1) 0 0",
                          }}
                        >
                          {c.visits} atendimento{c.visits === 1 ? "" : "s"} · Último: {c.lastDate}
                        </p>
                      </div>
                      <span
                        style={{
                          fontFamily: fontBody,
                          fontSize: "var(--font-size-xs)",
                          fontWeight: 700,
                          color: colors.primaryText,
                          flexShrink: 0,
                        }}
                      >
                        R$ {c.totalSpent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
