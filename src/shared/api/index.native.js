// Ponto de acesso à API no app Expo (o Metro prefere este arquivo ao index.js): tudo em mock, sem o cliente HTTP do web
import { mockAdapter } from "./mockAdapter";

export { ApiError, errorMessage, PUSH_STATUS } from "./contract";

export const api = mockAdapter;
