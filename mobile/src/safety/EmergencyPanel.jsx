// Emergência: ligar para o 190 primeiro, com a opção de também registrar na Kira (risco imediato, sem anonimato) · API: nenhuma
import { AlertTriangle, Bell, LockOpen, MessageSquareWarning, Phone, UserX } from "lucide-react-native";
import { useState } from "react";
import { Linking, Pressable, View } from "react-native";
import { Button, Stack, Text } from "../components/primitives";
import { colors, radius } from "../theme";

const consequences = [
  { icon: Bell, text: "Um responsável é alertado na hora, sem entrar em fila" },
  { icon: UserX, text: "O perfil envolvido é suspenso de forma preventiva" },
  { icon: LockOpen, text: "Sua identidade fica visível só para a equipe, não é anônima aqui" },
];

export const EmergencyPanel = ({ onRegister, registering, failed, onChooseOther }) => {
  const [callFailed, setCallFailed] = useState(false);
  const call = () => {
    setCallFailed(false);
    Linking.openURL("tel:190").catch(() => setCallFailed(true));
  };
  return (
    <Stack gap={14}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: radius.lg,
          backgroundColor: colors.destructive10,
        }}
      >
        <AlertTriangle size={20} color={colors.destructive} />
        <Text size="sm" weight={700} color={colors.destructiveText} style={{ flex: 1 }}>
          Se você está em perigo agora, ligue primeiro
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ligar para 190 agora"
        onPress={call}
        style={({ pressed }) => ({
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: radius.xl,
          backgroundColor: colors.destructive,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Phone size={18} color={colors.white} />
        <Text size="md" weight={700} color={colors.white}>
          Ligar para 190 agora
        </Text>
      </Pressable>
      {callFailed && (
        <Text size="sm" color={colors.destructiveText} accessibilityRole="alert">
          Não foi possível abrir o telefone. Ligue 190 pelo seu aparelho.
        </Text>
      )}
      <Button
        variant="secondary"
        radiusSize="xl"
        pad={13}
        size="sm"
        icon={MessageSquareWarning}
        disabled={registering}
        onPress={onRegister}
      >
        {registering ? "Registrando..." : "Também registrar na Kira"}
      </Button>
      {failed && (
        <Text size="sm" color={colors.primaryText} accessibilityRole="alert" style={{ lineHeight: 19 }}>
          Não foi possível registrar agora. Tente de novo. Se for urgente, ligue 190.
        </Text>
      )}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14, gap: 10 }}>
        <Text size="xs" color={colors.mutedForeground}>
          Ao registrar, a equipe da Kira é notificada imediatamente e:
        </Text>
        {consequences.map(({ icon: Icon, text }) => (
          <View key={text} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            <Icon size={14} color={colors.mutedForeground} style={{ marginTop: 2 }} />
            <Text size="xs" color={colors.mutedForeground} style={{ flex: 1, lineHeight: 17 }}>
              {text}
            </Text>
          </View>
        ))}
      </View>
      {onChooseOther && (
        <Pressable
          accessibilityRole="button"
          onPress={onChooseOther}
          style={{ minHeight: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Text size="sm" weight={600} color={colors.primaryText}>
            Escolher outro motivo
          </Text>
        </Pressable>
      )}
    </Stack>
  );
};
