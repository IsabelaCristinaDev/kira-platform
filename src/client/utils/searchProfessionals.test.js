// Testes da busca de profissionais (filtros e ordenação)
import { describe, expect, it } from "vitest";
import { professionals } from "../../test/professionals";
import { defaultSearchFilters } from "../data/options";
import { searchProfessionals } from "./searchProfessionals";

const base = { query: "", category: "todos", filters: defaultSearchFilters };
const ids = (list) => list.map((p) => p.id);

describe("searchProfessionals", () => {
  it("sem distância, ordena pela nota por padrão", () => {
    const ratings = searchProfessionals(professionals, base).map((p) => p.rating ?? 0);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });
  it("filtra a categoria pelos serviços", () => {
    expect(ids(searchProfessionals(professionals, { ...base, category: "unhas" }))).toEqual(["c"]);
    expect(ids(searchProfessionals(professionals, { ...base, category: "barba" }))).toEqual(["b"]);
  });
  it("usa a categoria do serviço em vez das palavras", () => {
    const pro = (id, name, services) => ({ id, name, role: "", description: "", services });
    const lista = [
      pro("spa", "Espaço Serena", [{ name: "Spa dos pés", category: "UNHAS" }]),
      pro("nome", "Barbearia do Zé", [{ name: "Corte", category: "CABELO" }]),
      pro("antigo", "Barbearia antiga", [{ name: "Navalha" }]),
    ];
    expect(ids(searchProfessionals(lista, { ...base, category: "unhas" }))).toEqual(["spa"]);
    expect(ids(searchProfessionals(lista, { ...base, category: "barba" }))).toEqual(["antigo"]);
  });
  it("busca no nome e nos serviços sem diferenciar maiúsculas", () => {
    expect(ids(searchProfessionals(professionals, { ...base, query: "STUDIO" }))).toEqual(["a"]);
    expect(ids(searchProfessionals(professionals, { ...base, query: "manicure" }))).toEqual(["c"]);
  });
  it("ordena por preço e respeita a nota mínima", () => {
    const r = searchProfessionals(professionals, {
      ...base,
      filters: { ...defaultSearchFilters, sort: "preco", minRating: 4.5 },
    });
    expect(ids(r)).toEqual(["c", "a"]);
  });
  it("não descarta quem não tem preço nem distância", () => {
    const r = searchProfessionals(professionals, { ...base, filters: { ...defaultSearchFilters, price: 50 } });
    expect(ids(r)).toEqual(expect.arrayContaining(["b", "c", "e"]));
    expect(ids(r)).not.toContain("a");
  });
});
