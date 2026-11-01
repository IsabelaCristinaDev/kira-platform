// Respostas rápidas do chat: chips que enviam o texto ao toque · API: nenhuma
import { View } from "react-native";
import { Chip } from "../components/primitives";
import { ASSISTANT_INDENT } from "./MessageBubble";

export const QuickReplies = ({ options, onPick, indent = true, center = false }) => (
  <View
    accessibilityLabel="Respostas rápidas"
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingLeft: indent ? ASSISTANT_INDENT : 0,
      justifyContent: center ? "center" : "flex-start",
    }}
  >
    {options.map((option) => (
      <Chip key={option} onPress={() => onPick(option)} outlined>
        {option}
      </Chip>
    ))}
  </View>
);
