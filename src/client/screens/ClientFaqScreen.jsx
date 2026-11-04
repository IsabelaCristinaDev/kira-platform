// Perguntas frequentes do cliente · respostas só onde o comportamento já está documentado
import { useSession } from "../../context/SessionContext";
import { FaqView } from "../../shared/components/FaqView";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { clientFaqDemo } from "../../shared/data/demo";

export default function ClientFaqScreen() {
  const { setScreen } = useSession();
  return (
    <ScreenFrame
      onBack={() => setScreen("clientHelpSupport")}
      title="Perguntas frequentes"
      subtitle="Encontre respostas rápidas."
    >
      <FaqView items={clientFaqDemo} />
    </ScreenFrame>
  );
}
