import * as mongodb from "mongodb";
import { Field, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IMongoDocument implements mongodb.Document {
    @Field()
    _id?: string;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;

    @Field()
    createdBy?: string;
}
