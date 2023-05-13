import cors from "cors";
import express from "express";
import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./account/userResolver";
import { ContractResolver } from "./contract/contractResolver";

export const resolvers: NonEmptyArray<Function> = [
    UserResolver,
    ContractResolver,
];

export function configureRoutes(app: express.Router) {
    app.use(cors<cors.CorsRequest>({ origin: "http://localhost:3000" }));
}
