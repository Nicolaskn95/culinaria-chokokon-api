import { ICustomer, IAddress } from "../interfaces/customer/ICustomer.ts";
import mongoose from "npm:mongoose";

export class Customer implements ICustomer {
  _id?: mongoose.Types.ObjectId;
  name: ICustomer["name"];
  reference: ICustomer["reference"];
  phone?: ICustomer["phone"];
  address?: IAddress;
  userId?: ICustomer["userId"];

  constructor(customer: ICustomer) {
    this._id = customer._id;
    this.name = customer.name;
    this.reference = customer.reference;
    this.phone = customer.phone;
    this.address = customer.address;
    this.userId = customer.userId;
  }
}
