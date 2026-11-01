// Ponto único de acesso à API: adaptador HTTP do kira-backend · URL em VITE_API_URL · chat de IA e acompanhamento: mock, ainda sem backend
import { httpAdapter } from "./httpAdapter";
import { createMockBookings } from "./mockBookings";
import { mockChat } from "./mockChat";

export { ApiError, errorMessage } from "./contract";
export { authStore } from "./http";

export const api = {
  ...httpAdapter,
  chat: mockChat,
  bookings: createMockBookings(undefined, { failFirst: false }),
};
