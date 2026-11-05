// Câmera (selfie do cadastro e provador): abre, captura em quadrado e libera a câmera · API do navegador: getUserMedia
import { useEffect, useRef, useState } from "react";

// options.facingMode: "user" (frontal, espelhada) ou "environment" (traseira, sem espelho)
export function useSelfieCamera(photo, setPhoto, { facingMode = "user" } = {}) {
  const mirror = facingMode === "user";
  const [status, setStatus] = useState(photo ? "captured" : "idle"); // idle | streaming | error | captured
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };
  const start = async () => {
    setError("");
    setStatus("idle");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("streaming");
    } catch {
      setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      setStatus("error");
    }
  };
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    if (mirror) {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
    stop();
    setStatus("captured");
  };
  const retake = () => {
    setPhoto("");
    start();
  };

  // Abre a câmera ao entrar na tela (se ainda não há selfie) e libera ao sair
  useEffect(() => {
    if (!photo) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cSelfieStatus: status,
    cSelfieError: error,
    startClientSelfieCamera: start,
    cSelfieVideoRef: videoRef,
    cSelfieCanvasRef: canvasRef,
    captureClientSelfie: capture,
    retakeClientSelfie: retake,
    stopClientSelfieCamera: stop,
  };
}
