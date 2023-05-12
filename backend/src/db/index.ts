import { UUID } from "bson";
import * as mongodb from "mongodb";
import { Service } from "typedi";
import { IMongoDocument } from "../modules/common/classes";

@Service()
export class DbService {
  ATLAS_URI = process.env.ATLAS_URI;
  DATABASE_NAME = process.env.DATABASE_NAME;

  client: mongodb.MongoClient;

  init() {
    if (!this.ATLAS_URI) {
      throw new Error("ATLAS_URI should be defined");
    }

    this.client = new mongodb.MongoClient(this.ATLAS_URI, {
      pkFactory: { createPk: () => new UUID().toString() },
    });
  }

  getDb(databaseName?: string) {
    return this.client.db(databaseName || this.DATABASE_NAME);
  }

  getCollection<T extends IMongoDocument>(
    collectionName: string
  ): mongodb.Collection<T> {
    return this.getDb().collection(collectionName) as mongodb.Collection<T>;
  }

  async withTransaction(
    executeFn: (session: mongodb.ClientSession) => Promise<void>
  ) {
    const session = this.client.startSession();

    try {
      await session.withTransaction(executeFn);
    } catch (e) {
      console.error("Error in mongodb transaction", e);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  constructor() {
    this.init();
  }
}
