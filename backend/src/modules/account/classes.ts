import { Extensions, Field, ObjectType } from "type-graphql";
import * as common from "../common";
import * as enums from "../../enums";

@ObjectType({ implements: common.classes.IMongoDocument })
export class AccessToken extends common.classes.IMongoDocument {
    @Field()
    _id?: string;

    @Field()
    userId: string;

    @Field()
    token: string;
}

@ObjectType({ implements: common.classes.IMongoDocument })
export class Account extends common.classes.IMongoDocument {
    @Field()
    _id?: string;

    @Field()
    companyName: string;
}

@ObjectType({ implements: common.classes.IMongoDocument })
export class User extends common.classes.IMongoDocument {
    @Field()
    _id?: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    emailId: string;

    @Field()
    @Extensions({ visible: false })
    password: string;

    @Field()
    accountId: string;

    @Field((type) => [enums.Roles])
    roles: enums.Roles[];
}

export interface IPasetoData {
    userId: string;
    roles?: enums.Roles[];
}
