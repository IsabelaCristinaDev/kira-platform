// Adaptador mock usado só pelo app Expo (ver index.native.js): dados locais com latência simulada · mock
import { recommendProfessionals } from "../../client/recommendation";
import { mockProfessionals } from "../data/professionals";
import { ApiError, PUSH_STATUS } from "./contract";
import { mockBookings } from "./mockBookings";
import { mockChat } from "./mockChat";
import { mockReports } from "./mockReports";
import { mockTryOn } from "./mockTryOn";

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Horários de exemplo, sempre os mesmos para o mesmo dia e profissional
const getDaySchedule = (date, pro) => {
  const day = date.getDate();
  const base = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];
  if (day % 6 === 0) return []; // dia sem horários
  const seed = (day * 7 + pro.id * 13) % base.length;
  const count = 3 + (day % 4);
  const slots = [];
  for (let i = 0; i < count; i++) slots.push(base[(seed + i * 3) % base.length]);
  return Array.from(new Set(slots)).sort();
};

export const mockAdapter = {
  professionals: {
    list: async () => {
      await wait(650);
      return mockProfessionals;
    },
  },
  availability: {
    // Dias múltiplos de 13 falham na primeira tentativa, para exercitar o estado de erro.
    get: async ({ pro, date, retried = false }) => {
      await wait(500);
      if (date.getDate() % 13 === 0 && !retried) throw new ApiError("availability_unavailable");
      return getDaySchedule(date, pro);
    },
  },
  recommendations: {
    get: async (params) => {
      await wait(550);
      return recommendProfessionals(mockProfessionals, params);
    },
  },
  address: {
    lookupCep: async () => {
      await wait(500);
      return { street: "Av. T-4", neighborhood: "Setor Bueno", city: "Goiânia", state: "GO" };
    },
  },
  profile: {
    save: async () => {
      await wait(700);
      return { ok: true };
    },
  },
  // O Expo não tem service worker; o push do celular fica para quando o mobile for ligado ao backend
  notifications: {
    getPublicKey: async () => null,
    registerDevice: async () => null,
    removeDevice: async () => null,
    enable: async () => PUSH_STATUS.UNSUPPORTED,
    sync: async () => {},
    disable: async () => {},
    forget: async () => {},
  },
  chat: mockChat,
  tryOn: mockTryOn,
  reports: mockReports,
  bookings: mockBookings,
};
