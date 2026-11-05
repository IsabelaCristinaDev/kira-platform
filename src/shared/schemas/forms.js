// Regras de validação dos cadastros e do perfil (zod) · mensagens em português · sem API
import { z } from "zod";
import { isValidCnpj, isValidCpf, onlyDigits } from "../utils/format";

const nameRule = z.string().refine((v) => v.trim().length >= 3 && /\s/.test(v.trim()), "Informe nome e sobrenome");
const emailRule = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido");
const phoneRule = z.string().refine((v) => onlyDigits(v).length >= 10, "Telefone incompleto");
const passwordRule = z
  .string()
  .refine((v) => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v), "Mínimo 8 caracteres, com maiúscula e número");
const birthRule = z.string().superRefine((v, ctx) => {
  if (!v) return ctx.addIssue({ code: "custom", message: "Informe sua data de nascimento" });
  const age = (Date.now() - new Date(v).getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 18) ctx.addIssue({ code: "custom", message: "Você precisa ter pelo menos 18 anos" });
});
const required = (message) => z.preprocess((v) => v ?? "", z.string().min(1, message));
const photoRule = required("Adicione uma foto de perfil");
const confirmCheck = (d, ctx) => {
  if (d.password !== d.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "As senhas não coincidem" });
};

export const profileEditSchema = z.object({ name: nameRule, email: emailRule, phone: phoneRule });

export const clientPersonalSchema = z
  .object({
    photo: photoRule,
    name: nameRule,
    cpf: z.string().refine(isValidCpf, "CPF inválido"),
    birth: birthRule,
    gender: required("Selecione uma opção"),
    phone: phoneRule,
    email: emailRule,
    password: passwordRule,
    confirm: z.string(),
  })
  .superRefine(confirmCheck);

export const proPersonalSchema = z
  .object({
    photo: photoRule,
    name: nameRule,
    documentType: z.string(),
    document: z.string(),
    birth: birthRule,
    phone: phoneRule,
    email: emailRule,
    password: passwordRule,
    confirm: z.string(),
  })
  .superRefine((d, ctx) => {
    const ok = d.documentType === "cpf" ? isValidCpf(d.document) : isValidCnpj(d.document);
    if (!ok) ctx.addIssue({ code: "custom", path: ["document"], message: "Documento inválido" });
    confirmCheck(d, ctx);
  });

export const addressSchema = z.object({
  cep: z.string().refine((v) => onlyDigits(v).length === 8, "CEP inválido"),
  street: z.string().refine((v) => v.trim(), "Informe a rua"),
  number: z.string().refine((v) => v.trim(), "Informe o número"),
  neighborhood: z.string().refine((v) => v.trim(), "Informe o bairro"),
  city: z.string().refine((v) => v.trim(), "Informe a cidade"),
  state: z.string().refine((v) => v.trim().length === 2, "Use a sigla do estado (ex.: GO)"),
});

// Esqueci a senha: e-mail; nova senha: código do e-mail (vem no link) e a senha duas vezes
export const forgotPasswordSchema = z.object({ email: emailRule });

export const resetPasswordSchema = z
  .object({
    token: z.string().refine((v) => v.trim(), "Cole o código que chegou no seu e-mail"),
    password: passwordRule,
    confirm: z.string(),
  })
  .superRefine(confirmCheck);

export const termsSchema = z.object({
  termsUse: z.boolean().refine(Boolean, "Aceite os Termos de Uso para continuar"),
  termsPrivacy: z.boolean().refine(Boolean, "Aceite a Política de Privacidade para continuar"),
});

// Devolve { ok, errors } com a primeira mensagem de cada campo
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, errors: {} };
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key !== undefined && !(key in errors)) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
