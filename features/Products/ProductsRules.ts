import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Types } from "npm:mongoose@7";
import { IProduct } from "../../interfaces/product/IProduct.ts";
import { Category } from "../../interfaces/product/IProduct.ts";

const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nome do produto deve ter pelo menos 3 caracteres")
    .max(50, "Nome do produto não pode ter mais que 50 caracteres"),
  price: z.number().positive("Preço do produto deve ser maior que 0"),
  category: z.nativeEnum(Category, {
    errorMap: () => ({
      message: "Categoria do produto deve ser uma categoria válida",
    }),
  }),
  userId: z.string().optional(),
  description: z.string().optional(),
});

const updateProductSchema = productSchema.partial();

type ValidationResult = {
  isValid: boolean;
  errors?: string[];
};

export class ProductsRules {
  validateCreate(data: Partial<IProduct>): ValidationResult {
    const result = productSchema.safeParse(data);

    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map((err) => err.message),
      };
    }

    return { isValid: true };
  }

  validateUpdate(id: string, data: Partial<IProduct>): ValidationResult {
    const idValidation = this.validateId(id);
    if (!idValidation.isValid) {
      return idValidation;
    }

    const result = updateProductSchema.safeParse(data);

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
        errors: ["ID do produto inválido"],
      };
    }

    return { isValid: true };
  }
}
