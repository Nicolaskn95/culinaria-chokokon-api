import { Types } from "npm:mongoose";

export interface IBaseInterface {
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
