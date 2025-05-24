import mongoose from "npm:mongoose@7";
import { Print } from "../globals/output/Print.ts";
import { Env } from "../config/Env.ts";

const print = new Print();

interface IDatabaseConnection {
  username?: string;
  hostname: string;
  database: string;
  isLocal?: boolean;
}

export class Database {
  private username?: string;
  private password?: string;
  private hostname: string;
  private database: string;
  private isLocal: boolean;

  private printConnectionStringOnConnect = true;

  constructor(databaseConnection: IDatabaseConnection) {
    this.hostname = databaseConnection.hostname;
    this.database = databaseConnection.database;
    this.username = databaseConnection.username;
    this.isLocal = databaseConnection.isLocal ?? false;

    if (!this.isLocal) {
      this.password = Env.getDatabasePasswordByUsername(this.username ?? "");
    }

    this.validate();
  }

  private validate = (): void => {
    if (!this.hostname) {
      throw Error("[Database] Please provide a database hostname!");
    }
    if (!this.database) {
      throw Error("[Database] Please provide a database name!");
    }
    if (!this.isLocal) {
      if (!this.username) {
        throw Error("[Database] Please provide a database username!");
      }
      if (!this.password) {
        throw Error("[Database] Please provide a database password!");
      }
    }
  };

  public get connectionString(): string {
    if (this.isLocal) {
      return `mongodb://${this.hostname}/${this.database}`;
    }
    return `mongodb+srv://${this.username}:${this.password}@${this.hostname}/${this.database}`;
  }

  public connect = (): mongoose.Connection => {
    try {
      if (this.printConnectionStringOnConnect) {
        print.info(this.connectionString);
      }
      // filtra propriedades que não estão no schema
      mongoose.set("strictQuery", false);

      const connection = mongoose.createConnection(this.connectionString);

      if (connection) {
        print.success(
          `Successfully connected to ${this.database} at ${this.hostname}`
        );
      }
      return connection;
    } catch (error) {
      print.error(`Error connecting to database: ${error}`);
      throw error;
    }
  };
}
