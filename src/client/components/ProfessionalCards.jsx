// Cards de profissional, recomendação, ranking e agendamento · API: nenhuma (recebem dados do backend já convertidos)
import { ChevronRight, Clock, MapPin, Sparkles, Star } from "lucide-react";
import { SecondaryButton } from "../../shared/components/ui";
import { statusOf } from "../../shared/data/appointments";
import { colors, fontBody, gradientKira } from "../../shared/theme";

// Foto do estúdio ou, sem foto cadastrada, as iniciais do nome
export const ProPhoto = ({ pro, size, radius = "var(--radius-xl)", style }) => {
  const box = { width: size, height: size, borderRadius: radius, flexShrink: 0, ...style };
  if (pro.photo) return <img src={pro.photo} alt={pro.name} style={{ ...box, objectFit: "cover" }} />;
  const initials = pro.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div
      role="img"
      aria-label={pro.name}
      style={{
        ...box,
        background: gradientKira,
        color: colors.primaryForeground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fontBody,
        fontWeight: 700,
        fontSize: typeof size === "number" && size < 48 ? "var(--font-size-xs)" : "var(--font-size-md)",
      }}
    >
      {initials}
    </div>
  );
};

export const ratingLabel = (pro) => (pro.rating != null ? pro.rating : "Novo");

export const ProfessionalCard = ({ pro, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-12)",
      padding: "var(--space-12)",
      borderRadius: "var(--radius-2xl)",
      border: `1px solid ${colors.border}`,
      background: colors.card,
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
    }}
  >
    <ProPhoto pro={pro} size={56} />
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
        {pro.name}
      </p>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          margin: "var(--space-1) 0 var(--space-4)",
        }}
      >
        {pro.role}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", flexWrap: "wrap" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
          }}
        >
          <Star size={11} color={colors.accent} fill={colors.accent} /> {ratingLabel(pro)}
          {pro.reviews ? ` (${pro.reviews})` : ""}
        </span>
        {(pro.distance != null || pro.city) && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
            }}
          >
            <MapPin size={11} /> {pro.distance != null ? `${pro.distance} km` : pro.city}
          </span>
        )}
      </div>
    </div>
    {pro.price != null && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "var(--space-4)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
          a partir de
        </span>
        <span
          style={{ fontFamily: fontBody, fontWeight: 700, fontSize: "var(--font-size-md)", color: colors.primaryText }}
        >
          R$ {pro.price}
        </span>
      </div>
    )}
    <ChevronRight size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
  </button>
);

export const CompatibilityBadge = ({ value }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      padding: "var(--space-4) var(--space-10)",
      borderRadius: "var(--radius-pill)",
      background: gradientKira,
      color: colors.primaryForeground,
      fontFamily: fontBody,
      fontSize: "var(--font-size-xs)",
      fontWeight: 700,
    }}
  >
    <Sparkles size={11} /> {value}% compatível
  </span>
);

export const RecommendedProfessionalCard = ({ pro, onViewProfile }) => {
  return (
    <div
      role="presentation"
      onClick={onViewProfile}
      style={{
        borderRadius: "var(--radius-3xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{ padding: "var(--space-12) var(--space-14) 0" }}>
        <CompatibilityBadge value={pro.compatibility} />
      </div>
      <div style={{ display: "flex", gap: "var(--space-12)", padding: "var(--space-14)" }}>
        <ProPhoto pro={pro} size={64} radius="var(--radius-2xl)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-md)",
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
              margin: "var(--space-1) 0 var(--space-5)",
            }}
          >
            {pro.role}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              flexWrap: "wrap",
              marginBottom: "var(--space-4)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
              }}
            >
              <Star size={11} color={colors.accent} fill={colors.accent} /> {ratingLabel(pro)}
              {pro.reviews != null ? ` (${pro.reviews} avaliações)` : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", flexWrap: "wrap" }}>
            {pro.price != null && (
              <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                a partir de R$ {pro.price}
              </span>
            )}
            {(pro.distance != null || pro.city) && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                }}
              >
                <MapPin size={11} /> {pro.distance != null ? `${pro.distance} km` : pro.city}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ padding: "0 var(--space-14) var(--space-14)" }}>
        <SecondaryButton onClick={onViewProfile}>Ver perfil</SecondaryButton>
      </div>
    </div>
  );
};

export const RatingStars = ({ value, size = 12 }) => {
  const rounded = Math.round(value ?? 0);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} color={colors.accent} fill={i < rounded ? colors.accent : "none"} />
      ))}
    </span>
  );
};

export const rankMedalStyle = (rank) => {
  if (rank === 1)
    return {
      background: "linear-gradient(135deg, var(--medal-gold-from), var(--medal-gold-to))",
      color: "var(--medal-gold-text)",
    };
  if (rank === 2)
    return {
      background: "linear-gradient(135deg, var(--medal-silver-from), var(--medal-silver-to))",
      color: colors.foreground,
    };
  if (rank === 3)
    return {
      background: "linear-gradient(135deg, var(--medal-bronze-from), var(--medal-bronze-to))",
      color: "var(--medal-bronze-text)",
    };
  return null;
};

export const RankingCard = ({ pro, rank, onClick }) => {
  const medal = rankMedalStyle(rank);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-12)",
        padding: "var(--space-12)",
        borderRadius: "var(--radius-2xl)",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        border: `1px solid ${medal ? "transparent" : colors.border}`,
        background: medal ? "hsl(var(--primary-hsl) / 0.06)" : colors.card,
        boxShadow: medal ? "var(--shadow-medal)" : "none",
      }}
    >
      {medal ? (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "var(--radius-round)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: "var(--font-size-xs)",
            flexShrink: 0,
            ...medal,
          }}
        >
          {rank}
        </div>
      ) : (
        <span
          style={{
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            flexShrink: 0,
          }}
        >
          {rank}
        </span>
      )}
      <ProPhoto pro={pro} size={52} />
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
          {pro.name}
        </p>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "var(--space-1) 0 var(--space-4)",
          }}
        >
          {pro.role}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          <RatingStars value={pro.rating} size={10} />
          <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            {ratingLabel(pro)}
            {pro.reviews != null ? ` (${pro.reviews})` : ""}
          </span>
        </div>
      </div>
      <ChevronRight size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
    </button>
  );
};

export const AppointmentCard = ({ appointment, onClick }) => {
  const status = statusOf(appointment);
  const pro = { name: appointment.proName, photo: null };
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-10)",
        padding: "var(--space-14)",
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-12)" }}>
        <ProPhoto pro={pro} size={48} radius="var(--radius-lg)" />
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
            {pro.name}
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              margin: "var(--space-1) 0 0",
            }}
          >
            {appointment.staffName ? `com ${appointment.staffName}` : appointment.payment}
          </p>
        </div>
        <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", fontWeight: 700, color: status.color }}>
          {status.label}
        </span>
      </div>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-sm)",
          fontWeight: 600,
          color: colors.foreground,
          margin: 0,
        }}
      >
        {appointment.service}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)", flexWrap: "wrap" }}>
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
          <Clock size={11} /> {appointment.date} • {appointment.time}
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
          <MapPin size={11} /> {appointment.proName}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
          {appointment.durationMinutes ? `${appointment.durationMinutes} min` : ""}
        </span>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: colors.primaryText,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          Ver detalhes <ChevronRight size={13} />
        </span>
      </div>
    </button>
  );
};
