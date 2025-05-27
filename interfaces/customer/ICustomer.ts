import { IBaseInterface } from "../base/IBaseInterface.ts";
import mongoose from "npm:mongoose@^7.0.0";

export interface IAddress {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  cep: string;
}

export interface ICustomer extends ICustomerVirtuals {
  _id?: mongoose.Types.ObjectId;
  name: string;
  reference: string;
  phone?: string;
  address?: IAddress;
  userId?: mongoose.Types.ObjectId;
}

export interface ICustomerVirtuals extends IBaseInterface {}
