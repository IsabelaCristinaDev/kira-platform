// Histórico de clientes do profissional: busca, filtro e detalhe · API: kira-backend (agendamentos concluídos do estúdio)
import { Search } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { ContactAvatar } from "../../shared/components/conversations";
import { Chip } from "../../shared/components/primitives";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { Sheet } from "../../shared/components/Sheet";
import { SecondaryButton } from "../../shared/components/ui";
import { useScheduling } from "../../context/SchedulingContext";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { formatRelativeDay, formatTime } from "../../shared/api/mappers";
import { useBusinessData } from "../hooks/useBusinessData";
import { completed } from "../utils/metrics";
import { colors, fontBody } from "../../shared/theme";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const p = { margin: 0, fontFamily: fontBody };

// Agrupa os atendimentos concluídos por cliente, do mais recente para o mais antigo
const groupClients = (appointments) => {
  const byClient = new Map();
  for (const a of completed(appointments).sort((x, y) => y.start - x.start)) {
    const key = a.clientId ?? a.clientName;
    const entry = byClient.get(key) ?? {
      id: String(key),
      name: a.clientName,
      lastAppointmentId: a.id,
      last: `${formatRelativeDay(a.start)}, ${formatTime(a.start)}`,
      count: 0,
      procedures: [],
    };
    entry.count += 1;
    if (a.service && !entry.procedures.includes(a.service)) entry.procedures.push(a.service);
    byClient.set(key, entry);
  }
  return [...byClient.values()];
};

export default function ProClientsScreen() {
  const { setScreen } = useSession();
  const { setSelectedAppointmentId } = useScheduling();
  const business = useBusinessData();
  const [query, setQuery] = useState("");
  const [onlyRegular, setOnlyRegular] = useState(false);
  const [detail, setDetail] = useState(null);
  const q = norm(query.trim());
  const clients = groupClients(business.appointments);
  const list = clients.filter((c) => norm(c.name).includes(q) && (!onlyRegular || c.count >= 3));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      <ScreenFrame
        onBack={() => setScreen("proProfileMenu")}
        title="Meus clientes"
        subtitle="Histórico de quem você já atendeu."
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-10)",
            background: colors.muted,
            borderRadius: "var(--radius-pill)",
            padding: "var(--space-12) var(--space-16)",
            marginBottom: "var(--space-10)",
          }}
        >
          <Search size={16} color={colors.mutedForeground} aria-hidden="true" />
          <label htmlFor="clients-search" className="k-sr-only">
            Buscar clientes
          </label>
          <input
            id="clients-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes..."
            autoComplete="off"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
            }}
          />
        </div>
        <div style={{ marginBottom: "var(--space-16)" }}>
          <Chip style={{ minHeight: 44 }} active={onlyRegular} onClick={() => setOnlyRegular((v) => !v)}>
            Recorrentes (3 ou mais)
          </Chip>
        </div>
        {business.loading ? (
          <SkeletonLoading count={3} />
        ) : business.error ? (
          <ErrorState
            onRetry={business.retry}
            message={errorMessage(business.error, "Não foi possível carregar os clientes agora.")}
          />
        ) : list.length === 0 ? (
          <p
            style={{
              ...p,
              fontSize: "var(--font-size-sm)",
              color: colors.mutedForeground,
              textAlign: "center",
              padding: "var(--space-32) 0",
            }}
          >
            {clients.length === 0 ? "Você ainda não tem atendimentos concluídos." : "Nenhum cliente encontrado."}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {list.map((c) => (
              <button
                key={c.id}
                type="button"
                className="k-row"
                onClick={() => setDetail(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-12)",
                  width: "100%",
                  padding: "var(--space-12) var(--space-14)",
                  borderRadius: "var(--radius-2xl)",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <ContactAvatar contact={c} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      ...p,
                      display: "block",
                      fontWeight: 700,
                      fontSize: "var(--font-size-sm)",
                      color: colors.foreground,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{ ...p, display: "block", fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                  >
                    Último atendimento: {c.last}
                  </span>
                  <span
                    style={{ ...p, display: "block", fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                  >
                    {c.procedures.join(", ")} · {c.count} atendimento{c.count === 1 ? "" : "s"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </ScreenFrame>
      {detail && (
        <Sheet title={`Histórico de ${detail.name}`} onClose={() => setDetail(null)}>
          <dl
            style={{
              margin: "0 0 var(--space-16)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
            }}
          >
            {[
              ["Atendimentos", detail.count],
              ["Último atendimento", detail.last],
              ["Procedimentos", detail.procedures.join(", ")],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-12)" }}>
                <dt style={{ color: colors.mutedForeground }}>{k}</dt>
                <dd style={{ margin: 0, fontWeight: 600, color: colors.foreground, textAlign: "right" }}>{v}</dd>
              </div>
            ))}
          </dl>
          <SecondaryButton
            onClick={() => {
              setSelectedAppointmentId(detail.lastAppointmentId);
              setScreen("proConversation");
            }}
          >
            Abrir conversa
          </SecondaryButton>
        </Sheet>
      )}
    </div>
  );
}
