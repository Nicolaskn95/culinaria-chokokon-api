import { load } from "https://deno.land/std@0.201.0/dotenv/mod.ts";

type ConstEnum<T, V = string> = Extract<T[keyof T], V>;
export type EnvironmentName = ConstEnum<typeof EnvironmentName>;
let name = (Deno.env.get("ENV") as EnvironmentName) ?? Deno.args[0] ?? "local";

export const EnvironmentName = {
  local: "local",
  dev: "dev",
  production: "production",
} as const;

if (name && EnvironmentName[name as EnvironmentName] === undefined) {
  name = EnvironmentName.dev;
}

if (Deno.env.get("ENV") === undefined) {
  await load({
    envPath: `.env.${name}`,
    examplePath: ".env.example",
    defaultsPath: ".env.defaults",
    allowEmptyValues: false,
    export: true,
  });
}

if (
  Object.values(EnvironmentName).includes(name as EnvironmentName) === false
) {
  throw new Error(`Invalid EnvironmentName: ${name}`);
}
``;

export class Env {
  static get name() {
    return name;
  }

  static get ip() {
    return Deno.env.get("IP") ?? "localhost";
  }

  static get serverPort() {
    const portFromArgs = Deno.args
      .find((arg) => arg.includes("--port"))
      ?.split("=")[1];

    const port = portFromArgs
      ? Number(portFromArgs)
      : Number(Deno.env.get("SERVER_PORT"));

    return port;
  }

  static get production() {
    return name === EnvironmentName.production;
  }

  static get dev() {
    return name === EnvironmentName.dev;
  }

  static get local() {
    return Boolean(this.ip) && !this.dev && !this.production;
  }

  static get isDevLike() {
    return this.local || this.dev;
  }

  static get isProductionLike() {
    return this.production;
  }

  static get object() {
    return Deno.env.toObject();
  }

  static get app() {
    return Deno.env.get("APP");
  }

  static get localDomain() {
    return Deno.env.get("LOCAL_DOMAIN");
  }

  static get globalDatabaseUserName() {
    return Deno.env.get("GLOBAL_DATABASE_USERNAME") ?? "playground";
  }

  static get globalDatabasePassword() {
    return (
      Deno.env.get("GLOBAL_DATABASE_PASSWORD") ??
      "seebqCpqRzseeHJlm5TfYieHKYqjrrdaZ6DvGVvjrJ6fVQVVuBaLUhEmilydfGOfXn9HwrKJyAJzTHtn3oaS2DZDZPlay"
    );
  }

  static get globalDatabaseCluster() {
    return (
      Deno.env.get("GLOBAL_DATABASE_CLUSTER") ??
      "projeto-culinario.1jwnm3k.mongodb.net"
    );
  }

  static getDatabasePasswordByUsername(databaseUsername: string): string {
    // If running in local environment, no database username/password is needed
    if (EnvTypes.local === "local") {
      console.log(
        "Running in local environment, no database username/password is needed"
      );
      return "";
    }

    if (!databaseUsername) throw Error("Please provide a database username!");

    const password = Deno.env.get(`DATABASE_PASSWORD_FOR_${databaseUsername}`);
    if (!password) throw Error(`No password found for ${databaseUsername}`);
    return password;
  }

  /** AUTHENTICATION */
  static get jwtSecret() {
    return (
      Deno.env.get("JWT_SECRET") ??
      "SDNuuJ3zhxLoZiYVXiBEq+X6H2SgIAnXE+ZIB7Fk5dk="
    );
  }

  static get jwtAuthAlgorithm() {
    return "HS256";
  }

  static get authAccessTokenExpiration() {
    return 36000000; // 10 hours
  }

  static get authRefreshTokenExpiration() {
    return Number(Deno.env.get("AUTH_REFRESH_TOKEN_EXPIRATION") || 1800000); // 30 minutes
  }

  static get virtualLocation() {
    return "home";
  }
}

export const EnvTypes = {
  local: "local",
  hml: "hml",
  dev: "dev",
  production: "production",
  developmentLike: "developmentLike",
  productionLike: "productionLike",
} as const;

type EnvType = keyof typeof EnvTypes;

type EnvObject<T> = { [key in EnvType]?: T };

export const env = <T = string>(objectOfEnvs: EnvObject<T>): T | string => {
  console.log({ name });
  const keys: EnvType[] = Object.keys(objectOfEnvs) as EnvType[];
  let result: T | null = null;

  keys.forEach((key) => {
    if (!result && key === name && objectOfEnvs[key]) {
      result = objectOfEnvs[key] as T;
    }
    if (!result && key === EnvTypes.developmentLike && Env.isDevLike) {
      result = objectOfEnvs[EnvTypes.developmentLike] as T;
    }
    if (!result && key === EnvTypes.productionLike && Env.isProductionLike) {
      result = objectOfEnvs[EnvTypes.productionLike] as T;
    }
  });

  return result ?? "";
};
