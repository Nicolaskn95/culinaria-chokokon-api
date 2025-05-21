import mongoose from "mongoose";
import { BaseRepository } from "../interfaces/base/BaseRepository.ts";
import { ICustomer } from "../interfaces/customer/ICustomer.ts";
import { ChokokonDB } from "../database/db/connect.ts";
import { CustomerSchema } from "../schemaValidator/CustomerSchema.ts";

class CustomerRepository extends BaseRepository<ICustomer> {
  constructor(
    model: mongoose.Model<ICustomer> = ChokokonDB.model<ICustomer>(
      "Customer",
      CustomerSchema,
    ),
  ) {
    super(model);
  }
}

export { CustomerRepository };
