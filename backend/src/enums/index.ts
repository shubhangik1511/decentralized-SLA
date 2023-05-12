import { registerEnumType } from "type-graphql";

export enum Collections {
  User = "user",
  Account = "account",
  AccessToken = "accessToken",
  Room = "room",
}

export enum Roles {
  AccountUser = "AccountUser",
  Admin = "Admin",
}

registerEnumType(Roles, {
  name: "Roles",
});
