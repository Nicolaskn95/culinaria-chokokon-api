import requestCheck from "npm:request-check";
import npmTthrowlhos, { IThrowlhos } from "npm:throwlhos";
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
        const joinedFieldNames = arrayOfInvalid
          .map((e: IInvalidField) => e.field)
          .join(", ");
        throw throwlhos.err_badRequest(
          `Os seguintes campos são obrigatórios: ${joinedFieldNames}`,
          arrayOfInvalid
        );
      }
    } catch (err) {
      console.warn(err);
      if (err && typeof err === "object") {
        throw {
          code: 422,
          message: (err as { message?: string })?.message ?? String(err),
          status: (err as { status?: unknown })?.status,
          errors: (err as { errors?: unknown })?.errors,
        } as IThrowlhos;
      } else {
        throw {
          code: 422,
          message: String(err),
        } as IThrowlhos;
      }
    }
  };
}
