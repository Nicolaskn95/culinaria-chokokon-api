import { ICustomer } from "../interfaces/customer/ICustomer.ts";
import mongoose from "npm:mongoose";

export class Customer implements ICustomer {
  _id?: mongoose.Types.ObjectId;
  name: ICustomer["name"];
  email: ICustomer["email"];
  reference: ICustomer["reference"];
  phone?: ICustomer["phone"];
  address?: ICustomer["address"];
  userId?: ICustomer["userId"];

  constructor(customer: ICustomer) {
    this._id = customer._id;
    this.name = customer.name;
    this.email = customer.email;
    this.reference = customer.reference;
    this.phone = customer.phone;
    this.address = customer.address;
    this.userId = customer.userId;
  }
}
