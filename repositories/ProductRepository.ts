import mongoose from "npm:mongoose@7";
import { BaseRepository } from "../interfaces/base/BaseRepository.ts";
import { ChokokonDB } from "../database/db/connect.ts";
import { IProduct } from "../interfaces/product/IProduct.ts";
import { ProductSchema } from "../schemaValidator/ProductSchema.ts";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    const model = ChokokonDB.model<IProduct>("Product", ProductSchema);
    super(model);
  }

  override findMany(
    query: mongoose.FilterQuery<IProduct>,
    options?: mongoose.QueryOptions
  ) {
    const result = super.findMany(query, options);
    return result;
  }

  override findById(
    id: string | mongoose.Types.ObjectId,
    options?: mongoose.QueryOptions
  ) {
    const result = super.findById(id, options);
    return result;
  }

  override findByIdAndUpdate(
    id: string | mongoose.Types.ObjectId,
    update: mongoose.UpdateQuery<IProduct>,
    options?: mongoose.QueryOptions
  ) {
    const result = super.updateById(id, update, options);
    return result;
  }

  override deleteOne(
    query: mongoose.FilterQuery<IProduct>,
    options?: mongoose.QueryOptions
  ) {
    const result = super.deleteOne(query, options);
    return result;
  }
}
