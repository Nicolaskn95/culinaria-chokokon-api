import { env, EnvTypes } from "../../config/Env.ts";
import { Database } from "../Database.ts";

type DatabaseConfiguration = {
  hostname: string;
  database: string;
  username: string;
};
const databaseConfiguration = env<DatabaseConfiguration>({
  [EnvTypes.local]: {
    hostname: "mongodb://localhost:27017",
    database: "CHOKOKON_LOCAL_DB",
    username: "",
  },

  [EnvTypes.developmentLike]: {
    hostname: "projeto-culinario.1jwnm3k.mongodb.net",
    database: "CHOKOKON_PRODUCTION_DB",
    username: "nicolasjap",
  },

  [EnvTypes.productionLike]: {
    hostname: "projeto-culinario.1jwnm3k.mongodb.net",
    database: "CHOKOKON_PRODUCTION_DB",
    username: "nicolasjap",
  },
}) as DatabaseConfiguration;

console.log(databaseConfiguration);

const database = new Database(databaseConfiguration);

export const connectionString = database.connectionString;

const ChokokonDB = database.connect();

export { ChokokonDB };
