// Cartão de agendamento do chat: horário sugerido pela IA com confirmar ou pedir outro · API: nenhuma
import { CalendarDays } from "lucide-react-native";
import { View } from "react-native";
import { Button, Card, Heading, Text } from "../components/primitives";
import { colors, shadowGlow } from "../theme";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const ScheduleCard = ({ suggestion, onConfirm, onOther, disabled }) => (
  <Card radiusSize="4xl" padding={14} style={[{ gap: 12, overflow: "visible" }, shadowGlow]}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primaryTint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CalendarDays size={18} color={colors.foreground} />
      </View>
      <Text
        size="xs"
        weight={600}
        color={colors.mutedForeground}
        style={{ letterSpacing: 0.7, textTransform: "uppercase" }}
      >
        Sugestão de horário
      </Text>
    </View>
    <View style={{ gap: 2 }}>
      <Heading size="lg" style={{ fontFamily: "DMSans_700Bold" }}>
        {capitalize(suggestion.dateLabel)}
      </Heading>
      <Text size="md">
        {suggestion.time} · {suggestion.service}
      </Text>
      <Text size="sm" color={colors.mutedForeground}>
        {suggestion.professionalName} · R$ {suggestion.price}
      </Text>
    </View>
    <View style={{ flexDirection: "row", gap: 8 }}>
      <View style={{ flex: 1 }}>
        <Button radiusSize="xl" pad={12} disabled={disabled} onPress={onConfirm}>
          Confirmar
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button variant="secondary" radiusSize="xl" pad={12} disabled={disabled} onPress={onOther}>
          Outro horário
        </Button>
      </View>
    </View>
  </Card>
);
