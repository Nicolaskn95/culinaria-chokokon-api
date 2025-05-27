import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Types } from "npm:mongoose@7";
import { ICustomer } from "../../interfaces/customer/ICustomer.ts";
import { BaseRules } from "../../interfaces/base/BaseRules.ts";

const addressSchema = z.object({
  street: z
    .string()
    .min(3, "Rua deve ter pelo menos 3 caracteres")
    .max(100, "Rua não pode ter mais que 100 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(10, "Número não pode ter mais que 10 caracteres"),
  complement: z
    .string()
    .max(50, "Complemento não pode ter mais que 50 caracteres")
    .optional(),
  city: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(50, "Cidade não pode ter mais que 50 caracteres"),
  state: z.string().min(2, "Estado deve ter minimo 2 caracteres"),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
});

const customerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais que 100 caracteres"),
  reference: z
    .string()
    .min(3, "Referência deve ter pelo menos 3 caracteres")
    .max(50, "Referência não pode ter mais que 50 caracteres"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Telefone deve estar no formato (00) 00000-0000"
    )
    .optional(),
  address: addressSchema.optional(),
  userId: z.string().optional(),
});

const updateCustomerSchema = customerSchema.partial();

type ValidationResult = {
  isValid: boolean;
  errors?: string[];
};

export class CustomerRules extends BaseRules {
  validateCreate(data: Partial<ICustomer>): ValidationResult {
    const result = customerSchema.safeParse(data);

    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map((err) => err.message),
      };
    }

    return { isValid: true };
  }

  validateUpdate(id: string, data: Partial<ICustomer>): ValidationResult {
    const idValidation = this.validateId(id);
    if (!idValidation.isValid) {
      return idValidation;
    }

    const result = updateCustomerSchema.safeParse(data);

    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map((err) => err.message),
      };
    }

    return { isValid: true };
  }

  validateId(id: string): ValidationResult {
    if (!Types.ObjectId.isValid(id)) {
      return {
        isValid: false,
        errors: ["ID do cliente inválido"],
      };
    }

    return { isValid: true };
  }
}
