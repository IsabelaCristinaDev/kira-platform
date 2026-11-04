// Perguntas frequentes do profissional · respostas só onde o comportamento já está documentado
import { useSession } from "../../context/SessionContext";
import { FaqView } from "../../shared/components/FaqView";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { proFaqDemo } from "../../shared/data/demo";

export default function ProFaqScreen() {
  const { setScreen } = useSession();
  return (
    <ScreenFrame
      onBack={() => setScreen("proHelp")}
      title="Perguntas frequentes"
      subtitle="Encontre respostas rápidas."
    >
      <FaqView items={proFaqDemo} />
    </ScreenFrame>
  );
}
