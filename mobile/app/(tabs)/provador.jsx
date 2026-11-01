// Provador virtual, passo 1: foto de referência do visual desejado · escolha local, nada é enviado
import { useRouter } from "expo-router";
import { Wand2 } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Button, Heading, Stack, Text } from "../../src/components/primitives";
import { ImageSlot } from "../../src/components/ImageSlot";
import { Screen } from "../../src/components/ui";
import { useTryOn } from "../../src/context/TryOnContext";
import { colors } from "../../src/theme";

export default function TryOnReferenceScreen() {
  const router = useRouter();
  const { referenceUri, setReferenceUri, setPhotoUri } = useTryOn();
  return (
    <Screen edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16, gap: 18 }}>
        <Stack gap={4}>
          <Heading size="2xl">Provador virtual</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Escolha uma referência do visual que você deseja experimentar.
          </Text>
        </Stack>
        <ImageSlot
          uri={referenceUri}
          onChange={(uri) => {
            setReferenceUri(uri);
            setPhotoUri("");
          }}
          icon={Wand2}
          emptyLabel="Escolher foto de referência"
          imageLabel="Referência escolhida"
        />
        <Button disabled={!referenceUri} onPress={() => router.push("/provador/foto")}>
          Continuar
        </Button>
      </ScrollView>
    </Screen>
  );
}
