import requestCheck from "npm:request-check";
import npmTthrowlhos, { IThrowlhos } from "npm:throwlhos";
import { i18next } from "../globals/I18n.ts";
const throwlhos = npmTthrowlhos.default;

export type Validator = (...args: Array<ICheckObj>) => void;

export interface ICheckObj {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
  isRequiredField?: boolean;
}

export interface IInvalidField {
  // deno-lint-ignore no-explicit-any
  value: any;
  // deno-lint-ignore no-explicit-any
  field: any;
  message: string;
}

export class BaseRules {
  protected rc;

  constructor() {
    this.rc = requestCheck.default();
  }

  validate = (...args: Array<ICheckObj>): void => {
    try {
      const arrayOfInvalid = this.rc.check(...args);
      if (arrayOfInvalid?.length) {
        const joinedFieldNames = arrayOfInvalid.map((e: IInvalidField) =>
          e.field
        ).join(", ");
        throw throwlhos.err_badRequest(
          i18next.t("base.rules.message", {
            fieldName: joinedFieldNames,
            count: arrayOfInvalid.length,
          }),
          arrayOfInvalid,
        );
      }
    } catch (err) {
      console.warn(err);
      throw {
        code: 422,
        message: err.message ?? err,
        status: err.status,
        errors: err.errors,
      } as IThrowlhos;
    }
  };
}
