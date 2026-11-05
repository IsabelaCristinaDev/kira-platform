// Diz se um profissional atende uma categoria, pela categoria dos serviços · função pura
import { categoryKeywords, categoryToApi } from "../data/options";

export const professionalText = (pro) =>
  [pro.name, pro.role, pro.description, ...pro.services.map((s) => s.name)].join(" ").toLowerCase();

export function matchesCategory(pro, category) {
  if (!category || category === "todos") return true;
  if (pro.services.some((s) => s.category)) {
    return pro.services.some((s) => s.category === categoryToApi[category]);
  }
  // Serviços sem categoria: reconhece por palavras
  const keywords = categoryKeywords[category] ?? [category];
  const text = professionalText(pro);
  return keywords.some((k) => text.includes(k));
}
