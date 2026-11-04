// Testes da montagem de CSV · API: nenhuma
import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

const columns = [
  { label: "Cliente", value: (r) => r.client },
  { label: "Valor", value: (r) => r.value.toFixed(2).replace(".", ",") },
];

describe("toCsv", () => {
  it("usa ponto e vírgula, cabeçalho e uma linha por registro", () => {
    expect(toCsv(columns, [{ client: "Ana Souza", value: 180 }])).toBe("Cliente;Valor\r\nAna Souza;180,00");
  });

  it("protege texto com separador, aspas e quebra de linha", () => {
    const csv = toCsv(columns, [{ client: 'Ana; "Aninha"', value: 1 }]);
    expect(csv.split("\r\n")[1]).toBe('"Ana; ""Aninha""";1,00');
  });

  it("sem registros devolve só o cabeçalho", () => {
    expect(toCsv(columns, [])).toBe("Cliente;Valor");
  });
});
