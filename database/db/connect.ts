import { env, EnvTypes } from "../../config/Env.ts";
import { Database } from "../Database.ts";

type DatabaseConfiguration = {
  hostname: string;
  database: string;
  username?: string;
  isLocal?: boolean;
};

const databaseConfiguration = env<DatabaseConfiguration>({
  [EnvTypes.local]: {
    hostname: "localhost:27017",
    database: "CHOKOKON_LOCAL_DB",
    isLocal: true,
  },

  [EnvTypes.developmentLike]: {
    hostname: "projeto-culinario.1jwnm3k.mongodb.net",
    database: "CHOKOKON_PRODUCTION_DB",
    username: "nicolasjap",
    isLocal: false,
  },

  [EnvTypes.productionLike]: {
    hostname: "projeto-culinario.1jwnm3k.mongodb.net",
    database: "CHOKOKON_PRODUCTION_DB",
    username: "nicolasjap",
    isLocal: false,
  },
}) as DatabaseConfiguration;

const database = new Database(databaseConfiguration);

export const connectionString = database.connectionString;

const ChokokonDB = database.connect();

export { ChokokonDB };
