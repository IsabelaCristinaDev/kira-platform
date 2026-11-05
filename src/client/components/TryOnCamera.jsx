// Câmera do Provador: mostra a imagem ao vivo e devolve a foto tirada · API do navegador: getUserMedia
import { AlertCircle } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody } from "../../shared/theme";
import { useSelfieCamera } from "../hooks/useSelfieCamera";

export function TryOnCamera({ facingMode = "user", onCapture, onCancel }) {
  const camera = useSelfieCamera("", (photo) => photo && onCapture(photo), { facingMode });
  const failed = camera.cSelfieStatus === "error";
  return (
    <>
      <div
        style={{
          boxSizing: "content-box",
          width: "100%",
          aspectRatio: "1/1",
          maxWidth: 280,
          margin: "0 auto var(--space-16)",
          borderRadius: "var(--radius-4xl)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${failed ? colors.destructive : colors.primary}`,
          background: colors.muted,
        }}
      >
        {failed ? (
          <div
            role="alert"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-8)",
              padding: "var(--space-20)",
              textAlign: "center",
            }}
          >
            <AlertCircle size={30} color={colors.destructive} />
            <span style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody }}>
              {camera.cSelfieError}
            </span>
          </div>
        ) : (
          <video
            ref={camera.cSelfieVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: facingMode === "user" ? "scaleX(-1)" : "none",
            }}
          />
        )}
      </div>
      <canvas ref={camera.cSelfieCanvasRef} style={{ display: "none" }} />
      <div
        style={{
          width: "100%",
          maxWidth: 280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-10)",
        }}
      >
        {failed ? (
          <PrimaryButton onClick={camera.startClientSelfieCamera}>Tentar novamente</PrimaryButton>
        ) : (
          <PrimaryButton onClick={camera.captureClientSelfie} disabled={camera.cSelfieStatus !== "streaming"}>
            Tirar foto
          </PrimaryButton>
        )}
        <SecondaryButton onClick={onCancel}>Cancelar</SecondaryButton>
      </div>
    </>
  );
}
