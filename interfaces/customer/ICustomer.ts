import { IBaseInterface } from "../base/IBaseInterface.ts";
import mongoose from "npm:mongoose";

export interface ICustomer extends ICustomerVirtuals {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  reference: string;
  phone?: string;
  address?: string;
  userId?: mongoose.Types.ObjectId;
}

export interface ICustomerVirtuals extends IBaseInterface {}
