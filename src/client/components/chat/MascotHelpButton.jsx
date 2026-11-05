// Botão de ajuda da Home: mascote da Kira com balão de apresentação (mouse: passar por cima; celular: encostar o dedo) · API: nenhuma
import { useRef, useState } from "react";
import { CHAT_AGENTS } from "../../../shared/api/chatContract";
import { AgentAvatar } from "./AgentAvatar";

// Depois de um toque o navegador ainda dispara eventos de mouse; este intervalo evita o balão ficar preso
const IGNORE_MOUSE_AFTER_TOUCH_MS = 700;

export function MascotHelpButton({ onOpen }) {
  const [hint, setHint] = useState(false);
  const lastTouch = useRef(0);

  const touchStart = () => {
    lastTouch.current = Date.now();
    setHint(true);
  };
  const touchEnd = () => {
    lastTouch.current = Date.now();
    setHint(false);
  };
  const mouseEnter = () => {
    if (Date.now() - lastTouch.current > IGNORE_MOUSE_AFTER_TOUCH_MS) setHint(true);
  };

  return (
    <button
      type="button"
      className="k-chip k-mascot-help"
      onClick={onOpen}
      onMouseEnter={mouseEnter}
      onMouseLeave={() => setHint(false)}
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchCancel={touchEnd}
      aria-label="Ajuda: conversar com a Kira"
      data-hint={hint}
      style={{
        position: "sticky",
        bottom: "var(--space-4)",
        marginLeft: "auto",
        marginRight: -20,
        display: "flex",
        width: 76,
        height: 76,
        padding: 0,
        border: "none",
        borderRadius: "var(--radius-round)",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <span className="k-hint" data-open={hint} aria-hidden="true">
        Oi! Sou Kira ✨
        <br />
        Bora descobrir sua próxima versão?
      </span>
      <AgentAvatar agent={CHAT_AGENTS.AI} size={76} glow />
    </button>
  );
}
