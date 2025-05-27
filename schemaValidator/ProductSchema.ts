import is from "jsr:@zarco/isness";
import { BaseSchema } from "../interfaces/base/BaseSchema.ts";
import mongoose from "npm:mongoose@7";
import { Product } from "../models/Product.ts";

class ProductSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        validate: {
          validator: is.string,
        },
      },
      price: {
        type: Number,
        required: true,
        validate: {
          validator: is.number,
        },
      },
      category: {
        type: String,
        required: true,
        validate: {
          validator: is.string,
        },
      },
      description: {
        type: String,
        required: false,
        validate: {
          validator: is.string,
        },
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
        validate: {
          validator: is.objectId,
        },
      },
      updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
        validate: {
          validator: (value: unknown): boolean => is.date(value),
        },
      },
    });
  }
}

const ProductSchema = new ProductSchemaClass().schema;
ProductSchema.loadClass(Product);
export { ProductSchema };
