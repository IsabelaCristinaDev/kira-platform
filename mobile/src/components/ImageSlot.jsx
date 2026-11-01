// Quadro de foto do Provador: mostra a imagem escolhida e deixa trocar pela galeria ou pela câmera · API: nenhuma
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import { useState } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { colors, radius } from "../theme";
import { Button, Stack, Text } from "./primitives";

const pickerOptions = { mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 };

export const ImageSlot = ({ uri, onChange, emptyLabel, icon: Icon = ImageIcon, imageLabel }) => {
  const [message, setMessage] = useState("");

  const fromGallery = async () => {
    setMessage("");
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const fromCamera = async () => {
    setMessage("");
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setMessage("Precisamos da câmera para tirar a foto. Você também pode escolher uma foto da galeria.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <Stack gap={12} align="center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={uri ? `${imageLabel}. Toque para trocar` : emptyLabel}
        onPress={fromGallery}
        style={{
          width: "100%",
          maxWidth: 280,
          aspectRatio: 1,
          borderRadius: radius["4xl"],
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderWidth: 2,
          borderStyle: uri ? "solid" : "dashed",
          borderColor: uri ? colors.primary : colors.border,
          backgroundColor: colors.muted,
        }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            accessibilityLabel={imageLabel}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <>
            <Icon size={30} color={colors.mutedForeground} />
            <Text size="xs" color={colors.mutedForeground}>
              {emptyLabel}
            </Text>
          </>
        )}
      </Pressable>
      <View style={{ flexDirection: "row", gap: 8, width: "100%", maxWidth: 280 }}>
        <View style={{ flex: 1 }}>
          <Button variant="secondary" radiusSize="xl" pad={10} size="sm" icon={ImageIcon} onPress={fromGallery}>
            Galeria
          </Button>
        </View>
        {Platform.OS !== "web" && (
          <View style={{ flex: 1 }}>
            <Button variant="secondary" radiusSize="xl" pad={10} size="sm" icon={Camera} onPress={fromCamera}>
              Tirar foto
            </Button>
          </View>
        )}
      </View>
      {message !== "" && (
        <Text
          size="xs"
          color={colors.primaryText}
          accessibilityRole="alert"
          style={{ textAlign: "center", maxWidth: 280 }}
        >
          {message}
        </Text>
      )}
    </Stack>
  );
};
