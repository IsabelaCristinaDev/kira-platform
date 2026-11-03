// Testes do horário de funcionamento: dia aberto, dia fechado e horário ainda sem carregar · API: nenhuma
import { describe, expect, it } from "vitest";
import { toBusinessHours } from "../api/mappers";
import { isOpenOn } from "./businessHours";

const sunday = new Date(2026, 10, 1);
const monday = new Date(2026, 10, 2);
const openOnSunday = toBusinessHours([{ diaSemana: "DOMINGO", horaInicio: "09:00:00", horaFim: "13:00:00" }]);

describe("isOpenOn", () => {
  it("segue os dias do estúdio, inclusive o domingo", () => {
    expect(isOpenOn(openOnSunday, sunday)).toBe(true);
    expect(isOpenOn(openOnSunday, monday)).toBe(false);
  });

  it("sem nenhum dia cadastrado, está fechado", () => {
    expect(isOpenOn(toBusinessHours([]), monday)).toBe(false);
  });

  it("sem o horário carregado, não bloqueia", () => {
    expect(isOpenOn(undefined, sunday)).toBe(true);
  });
});
