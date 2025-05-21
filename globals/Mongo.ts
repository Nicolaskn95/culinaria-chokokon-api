import mongoose from "npm:mongoose@7";
import is from "jsr:@zarco/isness";
import { throwlhos } from "./Throwlhos.ts";

export type oid = mongoose.Types.ObjectId;

export const ObjectId = (objectId: string | mongoose.Types.ObjectId) => {
  if (is.objectId(objectId)) {
    return new mongoose.Types.ObjectId(objectId);
  }

  throw throwlhos.err_unprocessableEntity("Invalid ObjectId", { objectId });
};
