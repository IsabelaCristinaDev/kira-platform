// Testes do adaptador HTTP: horários livres por funcionária, conversa como lida e perfil · fetch simulado
import { afterEach, describe, expect, it, vi } from "vitest";
import { authStore } from "./http";
import { httpAdapter as api } from "./httpAdapter";

const json = (status, body) => new Response(JSON.stringify(body), { status });
const slot = (hora) => ({ dataHoraInicio: `2026-11-10T${hora}:00` });
const businessRule = () => json(400, { erro: "REGRA_DE_NEGOCIO", mensagem: "x" });
const date = new Date(2026, 10, 10);
const appointment = { proId: "e1", serviceId: "s1", staffId: "f1" };
const urls = (fetch) => fetch.mock.calls.map(([url]) => String(url));

afterEach(() => vi.unstubAllGlobals());

describe("availability.get", () => {
  it("com a funcionária escolhida, pede só os horários dela", async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, [slot("09:00")]));
    vi.stubGlobal("fetch", fetch);
    await api.availability.get({ proId: "e1", serviceId: "s1", staffId: "f1", date });
    expect(urls(fetch)[0]).toContain("funcionariaId=f1");
  });
  it("sem funcionária, não manda o parâmetro", async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, [slot("09:00")]));
    vi.stubGlobal("fetch", fetch);
    await api.availability.get({ proId: "e1", serviceId: "s1", date });
    expect(urls(fetch)[0]).not.toContain("funcionariaId");
  });
});

describe("availability.forAppointment", () => {
  it("pede os horários da funcionária do atendimento", async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, [slot("09:00")]));
    vi.stubGlobal("fetch", fetch);
    expect(await api.availability.forAppointment({ appointment, date })).toEqual(["09:00"]);
    expect(urls(fetch)[0]).toContain(
      "/api/empresas/e1/disponibilidade/slots?servicoId=s1&data=2026-11-10&funcionariaId=f1",
    );
  });

  it("com a funcionária desativada, usa os horários do estúdio", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(businessRule())
      .mockResolvedValueOnce(json(200, [slot("10:30")]));
    vi.stubGlobal("fetch", fetch);
    expect(await api.availability.forAppointment({ appointment, date })).toEqual(["10:30"]);
    expect(urls(fetch)[1]).not.toContain("funcionariaId");
  });

  it("dia sem expediente fica sem horários, sem erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => businessRule()),
    );
    expect(await api.availability.forAppointment({ appointment, date })).toEqual([]);
  });

  it("sem funcionária, não repete a chamada", async () => {
    const fetch = vi.fn().mockImplementation(async () => businessRule());
    vi.stubGlobal("fetch", fetch);
    await api.availability.forAppointment({ appointment: { ...appointment, staffId: null }, date });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("erro de servidor continua sendo erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => json(500, { mensagem: "falhou" })),
    );
    await expect(api.availability.forAppointment({ appointment, date })).rejects.toMatchObject({ status: 500 });
  });
});

describe("messages.markAllRead", () => {
  it("marca a conversa inteira em uma chamada só", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    await api.messages.markAllRead("a1");
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toContain("/api/mensagens/agendamento/a1/lidas");
    expect(init.method).toBe("PATCH");
  });
});

describe("profile", () => {
  const perfil = {
    id: "c1",
    nome: "Ana",
    email: "ana@example.com",
    telefone: "62999990000",
    cpf: "52998224725",
    dataNascimento: "1995-01-01",
    genero: "FEMININO",
    endereco: { cep: "74000000", logradouro: "Rua A", numero: "1", bairro: "Centro", cidade: "Goiânia", estado: "GO" },
    latitude: -16.6,
    longitude: -49.2,
    fotoUrl: null,
  };

  const entrar = (tipo, id) => {
    const store = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    });
    authStore.set({ token: "t", refreshToken: "r", tipo, nome: "Ana", id });
  };

  it("usa a rota do tipo da conta", async () => {
    entrar("EMPRESA", "e1");
    const fetch = vi.fn().mockResolvedValue(json(200, { ...perfil, tipoEstabelecimento: "AUTONOMA" }));
    vi.stubGlobal("fetch", fetch);
    await api.profile.getMine();
    expect(urls(fetch)[0]).toContain("/api/empresas/e1/perfil");
  });

  it("salvar só o nome não apaga endereço nem coordenadas", async () => {
    entrar("CLIENTE", "c1");
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(200, perfil))
      .mockResolvedValueOnce(json(200, { ...perfil, nome: "Ana Lima" }));
    vi.stubGlobal("fetch", fetch);
    const salvo = await api.profile.saveMine({ name: "Ana Lima" });
    const [url, init] = fetch.mock.calls[1];
    const corpo = JSON.parse(init.body);
    expect(String(url)).toContain("/api/clientes/c1/perfil");
    expect(init.method).toBe("PUT");
    expect(corpo).toMatchObject({ nome: "Ana Lima", genero: "FEMININO", latitude: -16.6, longitude: -49.2 });
    expect(corpo.endereco.logradouro).toBe("Rua A");
    expect(corpo.email).toBeUndefined();
    expect(corpo.cpf).toBeUndefined();
    expect(salvo.name).toBe("Ana Lima");
  });

  const corpoAoSalvar = async (mudancas) => {
    entrar("CLIENTE", "c1");
    const fetch = vi.fn().mockResolvedValueOnce(json(200, perfil)).mockResolvedValueOnce(json(200, perfil));
    vi.stubGlobal("fetch", fetch);
    await api.profile.saveMine(mudancas);
    return JSON.parse(fetch.mock.calls[1][1].body);
  };
  const enderecoAtual = {
    cep: "74000000",
    street: "Rua A",
    number: "1",
    complement: "",
    neighborhood: "Centro",
    city: "Goiânia",
    state: "GO",
  };

  it("mudar o endereço apaga as coordenadas antigas", async () => {
    const corpo = await corpoAoSalvar({ address: { ...enderecoAtual, cep: "01001000", city: "São Paulo" } });
    expect(corpo.endereco.cidade).toBe("São Paulo");
    expect(corpo).toMatchObject({ latitude: null, longitude: null });
  });

  it("mudar o endereço com coordenadas novas usa as novas", async () => {
    const corpo = await corpoAoSalvar({
      address: { ...enderecoAtual, city: "São Paulo" },
      latitude: -23.5,
      longitude: -46.6,
    });
    expect(corpo).toMatchObject({ latitude: -23.5, longitude: -46.6 });
  });

  it("mandar o mesmo endereço mantém as coordenadas, mesmo com o CEP formatado", async () => {
    const corpo = await corpoAoSalvar({ address: { ...enderecoAtual, cep: "74000-000" } });
    expect(corpo).toMatchObject({ latitude: -16.6, longitude: -49.2 });
  });

  it("atualiza o nome da sessão depois de salvar", async () => {
    entrar("CLIENTE", "c1");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(json(200, perfil))
        .mockResolvedValueOnce(json(200, { ...perfil, nome: "Ana Lima" })),
    );
    await api.profile.saveMine({ name: "Ana Lima" });
    expect(authStore.get()).toMatchObject({ nome: "Ana Lima", token: "t" });
  });

  it("recusa do backend mantém o nome da sessão", async () => {
    entrar("CLIENTE", "c1");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(json(200, perfil))
        .mockResolvedValueOnce(json(400, { erro: "VALIDACAO", mensagem: "Telefone é obrigatório" })),
    );
    await expect(api.profile.saveMine({ name: "Outra" })).rejects.toMatchObject({ status: 400 });
    expect(authStore.get().nome).toBe("Ana");
  });
});

describe("reviews.listMine", () => {
  it("pede as avaliações feitas pela conta logada", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(json(200, [{ id: "r1", agendamentoId: "a1", nota: 5, tipoAvaliador: "CLIENTE" }]));
    vi.stubGlobal("fetch", fetch);
    expect(await api.reviews.listMine()).toMatchObject([{ id: "r1", appointmentId: "a1", rating: 5 }]);
    expect(urls(fetch)[0]).toMatch(/\/api\/avaliacoes\/minhas$/);
  });
});

describe("businessHours.get", () => {
  it("pede o horário do estúdio informado, sem login", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(json(200, [{ diaSemana: "DOMINGO", horaInicio: "09:00:00", horaFim: "13:00:00" }]));
    vi.stubGlobal("fetch", fetch);
    const week = await api.businessHours.get("e1");
    expect(week.find((d) => d.day === "DOMINGO").open).toBe(true);
    expect(urls(fetch)[0]).toMatch(/\/api\/empresas\/e1\/disponibilidade$/);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});

const entrar = (id) => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  });
  authStore.set({ token: "t", refreshToken: "r", tipo: "EMPRESA", nome: "Ana", id });
};

describe("portfolio", () => {
  it("lista as fotos do estúdio sem exigir login", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(json(200, [{ id: "f1", url: "/api/arquivos/a.jpg", dataCriacao: "2026-11-05T10:00:00" }]));
    vi.stubGlobal("fetch", fetch);
    const photos = await api.portfolio.list("e1");
    expect(urls(fetch)[0]).toContain("/api/studios/e1/portfolio");
    expect(photos).toEqual([
      { id: "f1", url: expect.stringContaining("/api/arquivos/a.jpg"), createdAt: "2026-11-05T10:00:00" },
    ]);
  });

  it("envia a foto como multipart no campo arquivo, na conta logada", async () => {
    entrar("e9");
    const fetch = vi
      .fn()
      .mockResolvedValue(json(201, { id: "f2", url: "/api/arquivos/b.png", dataCriacao: "2026-11-05T10:00:00" }));
    vi.stubGlobal("fetch", fetch);
    await api.portfolio.add(new File(["x"], "b.png", { type: "image/png" }));
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toContain("/api/empresas/e9/portfolio");
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.body.get("arquivo").name).toBe("b.png");
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("remove a foto da conta logada", async () => {
    entrar("e9");
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    await api.portfolio.remove("f2");
    expect(String(fetch.mock.calls[0][0])).toContain("/api/empresas/e9/portfolio/f2");
    expect(fetch.mock.calls[0][1].method).toBe("DELETE");
  });
});
