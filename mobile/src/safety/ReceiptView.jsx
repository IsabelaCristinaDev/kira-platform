// Confirmação da denúncia: protocolo e o que acontece em seguida (anônima na fila ou risco imediato) · API: nenhuma
import { Bell, CheckCircle2, LockOpen, ShieldCheck, UserX } from "lucide-react-native";
import { View } from "react-native";
import { Button, Card, Heading, Stack, Text } from "../components/primitives";
import { colors, radius } from "../theme";

const Line = ({ icon: Icon, text }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
    <Icon size={14} color={colors.mutedForeground} style={{ marginTop: 2 }} />
    <Text size="xs" color={colors.mutedForeground} style={{ flex: 1, lineHeight: 17 }}>
      {text}
    </Text>
  </View>
);

export const ReceiptView = ({ receipt, onClose }) => (
  <Stack gap={16} align="center" style={{ padding: 24 }}>
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: radius.round,
        backgroundColor: colors.primary12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CheckCircle2 size={28} color={colors.primary} />
    </View>
    <Heading size="2xl" style={{ textAlign: "center" }}>
      Denúncia recebida
    </Heading>
    <Text size="sm" color={colors.mutedForeground} style={{ textAlign: "center" }}>
      {receipt.immediate
        ? "A equipe da Kira foi avisada agora e vai entrar em contato com você."
        : "Sua identidade fica protegida perante o profissional e a equipe da Kira."}
    </Text>
    <Card padding={14} style={{ alignSelf: "stretch", gap: 4, alignItems: "center" }}>
      <Text size="xs" color={colors.mutedForeground}>
        Protocolo
      </Text>
      <Text size="xl" weight={700} color={colors.primaryText} selectable>
        {receipt.protocol}
      </Text>
    </Card>
    <Stack gap={8} style={{ alignSelf: "stretch" }}>
      {receipt.immediate ? (
        <>
          <Line icon={Bell} text="Um responsável foi alertado na hora, sem entrar em fila." />
          <Line icon={UserX} text="O perfil envolvido foi suspenso de forma preventiva." />
          <Line icon={LockOpen} text="Sua identidade fica visível só para a equipe, não é anônima aqui." />
        </>
      ) : (
        <Line icon={ShieldCheck} text="Sua denúncia entrou na fila de análise da equipe." />
      )}
    </Stack>
    <View style={{ alignSelf: "stretch" }}>
      <Button variant="secondary" onPress={onClose}>
        Fechar
      </Button>
    </View>
  </Stack>
);
