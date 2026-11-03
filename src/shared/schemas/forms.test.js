// Testes das regras de validação dos cadastros (mensagens e casos limite)
import { describe, expect, it } from "vitest";
import { initialClientForm, initialProForm } from "../data/forms";
import {
  addressSchema,
  clientPersonalSchema,
  forgotPasswordSchema,
  profileEditSchema,
  proPersonalSchema,
  resetPasswordSchema,
  termsSchema,
  validate,
} from "./forms";

describe("cadastro do cliente", () => {
  it("aponta todos os campos vazios", () => {
    const { ok, errors } = validate(clientPersonalSchema, initialClientForm);
    expect(ok).toBe(false);
    expect(errors.photo).toBe("Adicione uma foto de perfil");
    expect(errors.name).toBe("Informe nome e sobrenome");
    expect(errors.cpf).toBe("CPF inválido");
    expect(errors.birth).toBe("Informe sua data de nascimento");
    expect(errors.gender).toBe("Selecione uma opção");
    expect(errors.phone).toBe("Telefone incompleto");
    expect(errors.email).toBe("E-mail inválido");
    expect(errors.password).toBe("Mínimo 8 caracteres, com maiúscula e número");
  });
  it("aceita dados válidos", () => {
    const form = {
      ...initialClientForm,
      photo: "data:image/png;base64,a",
      name: "Maria Almeida",
      cpf: "529.982.247-25",
      birth: "1990-05-10",
      gender: "feminino",
      phone: "(62) 99999-9999",
      email: "maria@email.com",
      password: "Senha1234",
      confirm: "Senha1234",
    };
    expect(validate(clientPersonalSchema, form).ok).toBe(true);
  });
  it("recusa menor de idade e senhas diferentes", () => {
    const year = new Date().getFullYear() - 10;
    const { errors } = validate(clientPersonalSchema, {
      ...initialClientForm,
      birth: `${year}-01-01`,
      password: "Senha1234",
      confirm: "outra",
    });
    expect(errors.birth).toBe("Você precisa ter pelo menos 18 anos");
    expect(errors.confirm).toBe("As senhas não coincidem");
  });
});

describe("cadastro do profissional", () => {
  it("valida o documento conforme o tipo", () => {
    const { errors } = validate(proPersonalSchema, { ...initialProForm, documentType: "cnpj", document: "123" });
    expect(errors.document).toBe("Documento inválido");
  });
});

describe("endereço, termos e perfil", () => {
  it("exige os campos do endereço", () => {
    const { errors } = validate(addressSchema, {
      cep: "1",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "G",
    });
    expect(Object.keys(errors)).toEqual(["cep", "street", "number", "neighborhood", "city", "state"]);
  });
  it("exige o aceite dos termos", () => {
    const { errors } = validate(termsSchema, { termsUse: false, termsPrivacy: true });
    expect(errors).toEqual({ termsUse: "Aceite os Termos de Uso para continuar" });
  });
  it("valida a edição de perfil", () => {
    expect(validate(profileEditSchema, { name: "Ana", email: "a@b.co", phone: "6299999999" }).ok).toBe(false);
    expect(validate(profileEditSchema, { name: "Ana Lima", email: "a@b.co", phone: "6299999999" }).ok).toBe(true);
  });
});

describe("esqueci a senha", () => {
  it("exige um e-mail válido", () => {
    expect(validate(forgotPasswordSchema, { email: "ana" }).errors.email).toBe("E-mail inválido");
    expect(validate(forgotPasswordSchema, { email: "ana@kira.com" }).ok).toBe(true);
  });
  it("nova senha precisa do código, de senha forte e da confirmação igual", () => {
    const { errors } = validate(resetPasswordSchema, { token: " ", password: "fraca", confirm: "outra" });
    expect(errors.token).toBe("Cole o código que chegou no seu e-mail");
    expect(errors.password).toBe("Mínimo 8 caracteres, com maiúscula e número");
    expect(errors.confirm).toBe("As senhas não coincidem");
    expect(validate(resetPasswordSchema, { token: "abc", password: "NovaSenha1", confirm: "NovaSenha1" }).ok).toBe(
      true,
    );
  });
});
