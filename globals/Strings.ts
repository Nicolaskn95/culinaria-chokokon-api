// deno-lint-ignore-file
import is from "jsr:@zarco/isness";

export class Strings {
  static removeDashesAndDots(value: string): string | undefined {
    if (!value) return undefined;
    return value.trim().replace(/[.\-\\/]/g, "");
  }

  static removeNonDigitsFromCellphone(value: string): string | undefined {
    if (!value) return undefined;

    if (is.cellphone(value)) return value.trim().replace(/[^\d]/g, "");
  }

  static removeNonDigits(value?: string): string | undefined {
    if (!value) return undefined;

    return value.trim().replace(/[^\d]/g, "");
  }

  static objectToString(value?: any) {
    if (!value) return "";

    return Deno.inspect(value, { colors: true, depth: 8 });
  }
}
