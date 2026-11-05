// Meu portfólio: fotos de trabalhos que aparecem no perfil público · API: kira-backend (GET/POST/DELETE portfolio)
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { useAddPortfolioPhoto, usePortfolio, useRemovePortfolioPhoto } from "../../shared/hooks/usePortfolio";

// Mesmos limites do backend: até 20 fotos, JPG/PNG/WEBP de até 5 MB
const MAX_PHOTOS = 20;
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const checkFile = (file) => {
  if (!TYPES.includes(file.type)) return `"${file.name}" não é JPG, PNG ou WEBP.`;
  if (file.size > MAX_BYTES) return `"${file.name}" passa de 5 MB.`;
  return null;
};

export default function ProPortfolioScreen() {
  const { auth, setScreen } = useSession();
  const proId = auth?.id;
  const inputRef = useRef(null);
  const photos = usePortfolio(proId);
  const add = useAddPortfolioPhoto(proId);
  const remove = useRemovePortfolioPhoto(proId);
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const count = photos.data?.length ?? 0;
  const full = count >= MAX_PHOTOS;

  const upload = async (fileList) => {
    const files = [...fileList];
    if (inputRef.current) inputRef.current.value = "";
    const room = MAX_PHOTOS - count;
    const problems = [];
    const valid = [];
    for (const file of files) {
      const problem = checkFile(file);
      if (problem) problems.push(problem);
      else valid.push(file);
    }
    if (valid.length > room) problems.push(`Cabem só mais ${room} foto(s): as demais não foram enviadas.`);
    setSending(true);
    // Uma por vez: o backend recebe um arquivo por chamada
    for (const file of valid.slice(0, Math.max(room, 0))) {
      try {
        await add.mutateAsync(file);
      } catch (e) {
        problems.push(errorMessage(e, `Não foi possível enviar "${file.name}".`));
        break;
      }
    }
    setSending(false);
    setMessage(problems.length > 0 ? problems.join(" ") : null);
  };

  const removePhoto = async (id) => {
    setMessage(null);
    try {
      await remove.mutateAsync(id);
    } catch (e) {
      setMessage(errorMessage(e, "Não foi possível remover a foto."));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--space-24) var(--space-32)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Meu portfólio
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-16)",
          }}
        >
          Fotos dos seus trabalhos, visíveis no seu perfil. {count} de {MAX_PHOTOS} fotos · JPG, PNG ou WEBP até 5 MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={(e) => upload(e.target.files)}
        />
        <button
          type="button"
          disabled={sending || full || !proId}
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            padding: "var(--space-20)",
            borderRadius: "var(--radius-2xl)",
            border: `2px dashed ${colors.border}`,
            background: colors.muted,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-6)",
            cursor: sending || full ? "default" : "pointer",
            opacity: full ? 0.6 : 1,
            marginBottom: "var(--space-14)",
          }}
        >
          {sending ? (
            <Loader2 size={24} color={colors.mutedForeground} className="spin" />
          ) : (
            <ImagePlus size={24} color={colors.mutedForeground} />
          )}
          <span
            style={{
              fontSize: "var(--font-size-sm)",
              fontWeight: 600,
              color: colors.primaryText,
              fontFamily: fontBody,
            }}
          >
            {sending ? "Enviando…" : full ? "Limite de fotos atingido" : "Adicionar fotos"}
          </span>
        </button>
        {message && (
          <p
            role="alert"
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.destructiveText,
              margin: "0 0 var(--space-12)",
            }}
          >
            {message}
          </p>
        )}

        {photos.isLoading ? (
          <SkeletonLoading count={2} />
        ) : photos.isError ? (
          <ErrorState onRetry={photos.refetch} message="Não foi possível carregar o portfólio." />
        ) : count === 0 ? (
          <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            Você ainda não adicionou fotos.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--space-8)" }}>
            {photos.data.map((photo, i) => (
              <div
                key={photo.id}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  background: colors.muted,
                }}
              >
                <img
                  src={photo.url}
                  alt={`Trabalho ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <button
                  type="button"
                  className="k-reset"
                  aria-label={`Remover foto ${i + 1}`}
                  disabled={remove.isPending}
                  onClick={() => removePhoto(photo.id)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: "var(--radius-round)",
                    background: "hsl(var(--white-hsl) / 0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={13} color={colors.foreground} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
