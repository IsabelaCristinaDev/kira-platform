// Constantes visuais do chat: texto sobre gradiente, recuo das mensagens e animações discretas · API: nenhuma

// texto sobre o gradiente de marca (bolha do usuário, avatar da IA)
export const ON_GRADIENT = "hsl(var(--white-hsl))";

// largura do avatar das mensagens (28) mais o espaço até a bolha (8)
export const ASSISTANT_INDENT = 36;

export const bubbleText = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--font-size-base)",
  lineHeight: 1.4,
  margin: 0,
  overflowWrap: "anywhere",
};

// keyframes e classes do chat; reduced-motion desliga tudo
export const chatMotionCss = `
@keyframes kiraChatIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes kiraChatDot { 0%, 80%, 100% { opacity: .4; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes kiraChatSpin { to { transform: rotate(360deg); } }
@keyframes kiraChatPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
.k-chat-in { animation: kiraChatIn 220ms ease-out both; }
.k-chat-dot { animation: kiraChatDot 1.2s ease-in-out infinite; }
.k-chat-dot:nth-child(2) { animation-delay: .2s; }
.k-chat-dot:nth-child(3) { animation-delay: .4s; }
.k-chat-spin { animation: kiraChatSpin 1s linear infinite; }
.k-chat-pulse { animation: kiraChatPulse 1.2s ease-in-out infinite; }
.k-chat-chip { transition: transform 120ms ease; }
.k-chat-chip:active { transform: scale(.96); }
@media (prefers-reduced-motion: reduce) {
  .k-chat-in, .k-chat-dot, .k-chat-spin, .k-chat-pulse { animation: none; }
  .k-chat-chip { transition: none; }
  .k-chat-chip:active { transform: none; }
}
`;
