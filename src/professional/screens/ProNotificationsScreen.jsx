// Central de notificações do profissional · demonstração visual, dados de exemplo
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { NotificationCenter } from "../../shared/components/notifications";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { notificationsDemo } from "../../shared/data/demo";

export default function ProNotificationsScreen() {
  const { setScreen } = useSession();
  return (
    <ScreenFrame
      onBack={() => setScreen("proProfileMenu")}
      title="Notificações"
      subtitle="Lembretes e avisos dos seus atendimentos."
    >
      <DemoBanner />
      <NotificationCenter items={notificationsDemo} />
    </ScreenFrame>
  );
}
