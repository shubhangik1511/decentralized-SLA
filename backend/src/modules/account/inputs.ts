import { Field, InputType } from "type-graphql";
import { Account, User } from "./classes";
import * as mongodb from "mongodb";

@InputType()
export class AddUserInput implements Partial<User> {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  emailId: string;

  @Field()
  password: string;

}

@InputType()
export class SignUpInput implements Partial<User>, Partial<Account> {
  @Field()
  companyName: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  emailId: string;

  @Field()
  password: string;

}
