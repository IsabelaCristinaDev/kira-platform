// Central de notificações do cliente · demonstração visual, dados de exemplo
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { NotificationCenter } from "../../shared/components/notifications";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { notificationsDemo } from "../../shared/data/demo";

export default function ClientNotificationsScreen() {
  const { setScreen } = useSession();
  return (
    <ScreenFrame
      onBack={() => setScreen("clientProfile")}
      title="Notificações"
      subtitle="Lembretes e avisos dos seus agendamentos."
    >
      <DemoBanner />
      <NotificationCenter items={notificationsDemo} />
    </ScreenFrame>
  );
}
