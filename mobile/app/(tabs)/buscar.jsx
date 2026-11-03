// Busca de profissionais: texto, categorias, ordenação, carregando, erro e vazio · api.professionals
import { useScheduling } from "@kira/context/SchedulingContext";
import { api } from "@kira/shared/api";
import { mockProfessionals } from "@kira/shared/data/professionals";
import { searchProfessionals } from "../../src/utils/searchProfessionals";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SearchX, Search } from "lucide-react-native";
import { ScrollView, TextInput, View } from "react-native";
import { Chip, Heading, Stack } from "../../src/components/primitives";
import { EmptyState, ErrorState, SkeletonLoading } from "../../src/components/states";
import { ProfessionalCard, Screen } from "../../src/components/ui";
import { defaultSearchFilters, useSearch } from "../../src/context/SearchContext";
import { categories, sortOptions } from "../../src/data/categories";
import { colors, fonts, radius } from "../../src/theme";

export default function SearchScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, sort, setSort } = useSearch();
  const { setSelectedProId, resetScheduling } = useScheduling();
  // a lista carrega a cada entrada na tela; a busca em si é feita aqui, sem novo carregamento
  const load = useQuery({ queryKey: ["professionals"], queryFn: () => api.professionals.list() });
  const hasError = searchQuery.trim().toLowerCase() === "erro";
  const results = searchProfessionals(mockProfessionals, {
    query: searchQuery,
    category: categoryFilter,
    filters: { ...defaultSearchFilters, sort },
  });

  const clear = () => {
    setSearchQuery("");
    setCategoryFilter("todos");
    setSort(defaultSearchFilters.sort);
  };

  return (
    <Screen edges={["top"]}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 12 }}>
        <Heading size="2xl">Buscar</Heading>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minHeight: 48,
            paddingHorizontal: 16,
            borderRadius: radius.pill,
            backgroundColor: colors.muted,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            accessibilityLabel="Buscar profissional ou serviço"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Profissional ou serviço"
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.foreground }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {categories.map((c) => (
            <Chip key={c.id} active={categoryFilter === c.id} onPress={() => setCategoryFilter(c.id)}>
              {c.label}
            </Chip>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {sortOptions.map((o) => (
            <Chip key={o.id} active={sort === o.id} onPress={() => setSort(o.id)}>
              {o.label}
            </Chip>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
        {load.isFetching ? (
          <SkeletonLoading count={6} />
        ) : hasError || load.isError ? (
          <ErrorState onRetry={() => (hasError ? setSearchQuery("") : load.refetch())} />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nada por aqui"
            message="Tente outra palavra ou veja todas as categorias."
            action="Limpar busca"
            onAction={clear}
          />
        ) : (
          <Stack gap={10}>
            {results.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                pro={pro}
                onPress={() => {
                  setSelectedProId(pro.id);
                  resetScheduling();
                  router.push(`/profissional/${pro.id}`);
                }}
              />
            ))}
          </Stack>
        )}
      </ScrollView>
    </Screen>
  );
}
