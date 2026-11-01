// Campo de texto do chat: arredondado, envia pelo teclado ou pelo botão com gradiente · API: nenhuma
import { Send } from "lucide-react-native";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { GradientBox } from "../components/primitives";
import { colors, fonts, radius } from "../theme";

export const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [value, setValue] = useState("");
  const empty = !value.trim();
  const blocked = empty || disabled;

  const submit = () => {
    if (blocked) return;
    onSend(value);
    setValue("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minHeight: 52,
        paddingLeft: 18,
        paddingRight: 4,
        borderRadius: radius.pill,
        backgroundColor: colors.muted,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={submit}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        returnKeyType="send"
        blurOnSubmit={false}
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: fonts.body,
          fontSize: 16,
          color: colors.foreground,
          paddingVertical: 12,
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enviar mensagem"
        accessibilityState={{ disabled: blocked }}
        disabled={blocked}
        onPress={submit}
      >
        {blocked ? (
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primaryTint,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={20} color={colors.foreground} />
          </View>
        ) : (
          <GradientBox
            style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }}
          >
            <Send size={20} color={colors.white} />
          </GradientBox>
        )}
      </Pressable>
    </View>
  );
};
