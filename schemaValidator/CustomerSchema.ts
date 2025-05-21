import is from "jsr:@zarco/isness";
import { BaseSchema } from "../interfaces/base/BaseSchema.ts";
import mongoose from "mongoose";
import { Customer } from "../models/Customer.ts";

class CustomerSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlenght: 10,
        validate: {
          validator: is.string,
        },
      },
      email: {
        type: String,
        required: true,
        validate: {
          validator: is.email,
        },
      },
      reference: {
        type: String,
        required: true,
        validate: {
          validator: is.string,
        },
      },
      phone: {
        type: String,
        required: false,
        validate: {
          validator: is.string,
        },
      },
      address: {
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
          validator: (value: unknown) => is.date(value),
        },
      },
      default: {},
    });
  }
}

const CustomerSchema = new CustomerSchemaClass().schema;
CustomerSchema.loadClass(Customer);
export { CustomerSchema };
