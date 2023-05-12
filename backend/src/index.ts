import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import dotenv from "dotenv";
import * as path from "path";
import { buildSchemaSync } from "type-graphql";
import { configureRoutes as configureRoutes, resolvers } from "./modules";
import { Container } from "typedi";
import { AuthChecker } from "./modules/account/authChecker";
import { ContextType } from "./modules/common/contextType";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
configureRoutes(app);

const schema = buildSchemaSync({
    resolvers,
    emitSchemaFile: path.resolve(process.cwd(), "schema.gql"),
    container: Container,
    authChecker: AuthChecker,
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await apolloServer.start();

app.use(
    "/",
    cors<cors.CorsRequest>({ origin: "http://localhost:3000" }),
    bodyParser.json({ limit: "50mb" }),
    expressMiddleware(apolloServer, {
        context: async ({ req, res }): Promise<ContextType> => {
            return {
                token: req.headers.authorization ?? "",
            };
        },
    })
);

await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4001 }, resolve)
);

console.log(`🚀 Server ready at http://localhost:4001/`);
