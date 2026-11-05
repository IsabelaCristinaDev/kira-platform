// Provador: foto do cliente · FileReader local
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { useSignup } from "../../context/SignupContext";
import { useTryOn } from "../../context/TryOnContext";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { TryOnCamera } from "../components/TryOnCamera";

export default function ClientTryOnPhotoScreen() {
  const { goToTab, setScreen } = useSession();
  const { handlePhoto } = useSignup();
  const { setTryOnClientPhoto, tryOnClientPhoto } = useTryOn();
  const tryOnPhotoInputRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientTryOnReference")} />
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
          Sua foto
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Envie uma foto sua para vermos como o visual combina com você.
        </p>

        {cameraOpen ? (
          <TryOnCamera
            facingMode="user"
            onCapture={(photo) => {
              setTryOnClientPhoto(photo);
              setCameraOpen(false);
            }}
            onCancel={() => setCameraOpen(false)}
          />
        ) : (
          <>
            <button
              type="button"
              className="k-reset"
              onClick={() => tryOnPhotoInputRef.current?.click()}
              style={{
                boxSizing: "content-box",
                width: "100%",
                aspectRatio: "1/1",
                maxWidth: 280,
                margin: "0 auto var(--space-16)",
                borderRadius: "var(--radius-4xl)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-8)",
                border: `2px ${tryOnClientPhoto ? "solid" : "dashed"} ${tryOnClientPhoto ? colors.primary : colors.border}`,
                background: colors.muted,
                cursor: "pointer",
              }}
            >
              {tryOnClientPhoto ? (
                <img
                  src={tryOnClientPhoto}
                  alt="Foto enviada"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <Camera size={30} color={colors.mutedForeground} />
                  <span
                    style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody }}
                  >
                    Enviar sua foto
                  </span>
                </>
              )}
            </button>
            <input
              ref={tryOnPhotoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handlePhoto(e.target.files?.[0], setTryOnClientPhoto)}
            />

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
              <SecondaryButton onClick={() => setCameraOpen(true)}>Tirar foto</SecondaryButton>
              <PrimaryButton disabled={!tryOnClientPhoto} onClick={() => setScreen("clientTryOnResult")}>
                Gerar prévia
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
      <BottomNav active="clientTryOnReference" onNavigate={goToTab} />
    </div>
  );
}
