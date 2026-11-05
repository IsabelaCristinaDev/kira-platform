// Profissionais de exemplo só para os testes (formato de toProfessional) · não usado pelo app
const pro = (id, name, rating, price, services, extra = {}) => ({
  id,
  name,
  role: "Estúdio",
  description: "",
  photo: null,
  phone: "",
  address: "",
  city: "Goiânia",
  rating,
  reviews: null,
  price,
  distance: null,
  services: services.map((s, i) => ({ id: `${id}-${i}`, name: s, description: "", durationMinutes: 60, price })),
  ...extra,
});

export const professionals = [
  pro("a", "Studio Bella", 4.9, 80, ["Corte feminino", "Escova"]),
  pro("b", "Barbearia do Zé", 4.2, 45, ["Barba na navalha", "Corte masculino"]),
  pro("c", "Espaço Unhas", 4.7, 40, ["Manicure", "Pedicure"]),
  pro("d", "Clínica Pele", null, 150, ["Limpeza de pele"]),
  pro("e", "Sem serviços", 3.5, null, []),
];
