import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./account/userResolver";
import express from "express";
import cors from "cors";

export const resolvers: NonEmptyArray<Function> = [UserResolver];

export function configureRoutes(app: express.Router) {
    app.use(cors<cors.CorsRequest>({ origin: "http://localhost:3000" }));
}
