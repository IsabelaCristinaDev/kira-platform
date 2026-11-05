// Galeria de fotos de trabalhos no perfil do profissional · API: kira-backend (GET /api/studios/{id}/portfolio)
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { usePortfolio } from "../../shared/hooks/usePortfolio";

export const PortfolioGallery = ({ proId }) => {
  const { data: photos, isLoading, isError } = usePortfolio(proId);
  if (isLoading || isError) return null;
  return (
    <>
      <h2
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: "var(--font-size-base)",
          color: colors.foreground,
          margin: "0 0 var(--space-10)",
        }}
      >
        Portfólio
      </h2>
      {photos.length === 0 ? (
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-20)",
          }}
        >
          Ainda sem fotos de trabalhos.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-20)",
          }}
        >
          {photos.map((photo, i) => (
            <img
              key={photo.id}
              src={photo.url}
              alt={`Trabalho ${i + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                borderRadius: "var(--radius-md)",
                background: colors.muted,
                display: "block",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};
