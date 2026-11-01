// Provador virtual, passo 2: foto da cliente; segue para o consentimento ou direto para a prévia · escolha local
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Button, Heading, Stack, Text } from "../../src/components/primitives";
import { ImageSlot } from "../../src/components/ImageSlot";
import { Screen, ScreenHeader } from "../../src/components/ui";
import { useTryOn } from "../../src/context/TryOnContext";
import { colors } from "../../src/theme";

export default function TryOnPhotoScreen() {
  const router = useRouter();
  const { photoUri, setPhotoUri, consent, consentLoading } = useTryOn();
  const next = () => router.push(consent?.accepted ? "/provador/resultado" : "/provador/consentimento");
  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <Stack gap={4}>
          <Heading size="2xl">Sua foto</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Envie uma foto sua, de frente e com boa luz, para vermos como o visual combina com você.
          </Text>
        </Stack>
        <ImageSlot
          uri={photoUri}
          onChange={setPhotoUri}
          icon={Camera}
          emptyLabel="Escolher sua foto"
          imageLabel="Foto enviada"
        />
        <Button disabled={!photoUri || consentLoading} onPress={next}>
          Gerar prévia
        </Button>
      </ScrollView>
    </Screen>
  );
}
