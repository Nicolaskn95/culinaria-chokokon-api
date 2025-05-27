import { Types } from "npm:mongoose@7";
import { IProduct } from "../interfaces/product/IProduct.ts";

export class Product implements IProduct {
  _id?: Types.ObjectId;
  name: IProduct["name"];
  price: IProduct["price"];
  category: IProduct["category"];
  userId?: IProduct["userId"];

  constructor(product: IProduct) {
    this._id = product._id;
    this.name = product.name;
    this.price = product.price;
    this.category = product.category;
    this.userId = product.userId;
  }
}
