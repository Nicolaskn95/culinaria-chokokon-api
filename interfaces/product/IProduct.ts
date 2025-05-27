import mongoose from "npm:mongoose@^7.0.0";
import { IBaseInterface } from "../base/IBaseInterface.ts";

export enum Category {
  BEBIDAS = "bebidas",
  DOCES = "doces",
  SALGADOS = "salgados",
}

export interface IProduct extends IProductVirtuals {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: Category;
  userId?: mongoose.Types.ObjectId;
}

export interface IProductVirtuals extends IBaseInterface {}
