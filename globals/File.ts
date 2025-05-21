// deno-lint-ignore-file
import { Print } from "./output/Print.ts";

const print = new Print();

class File {
  static unencodeString(encodedString: any) {
    try {
      const decodedString = decodeURIComponent(encodedString);
      return decodedString;
    } catch (error) {
      print.error("Erro ao decodificar a string:", error);
      return "";
    }
  }

  static toObject(files?: Array<any>) {
    const object: { [key: string]: { location: string; fileName: string } } =
      {};
    if (files) {
      for (const [key, value] of Object.entries(files)) {
        const valueLocation = value?.[0]?.location || value?.location;
        const valueOriginalName = value?.[0]?.originalname ||
          value?.originalname;
        if (valueLocation) {
          object[`${key}`] = {
            location: this.unencodeString(valueLocation),
            fileName: valueOriginalName,
          };
        }
      }
    }

    return object;
  }
}

export { File };
