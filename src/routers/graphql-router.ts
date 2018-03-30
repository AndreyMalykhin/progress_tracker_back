import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import graphqlResolvers from "graphql-resolvers/graphql-resolvers";
import graphqlTypes from "graphql-schema/graphql-types";
import { makeExecutableSchema } from "graphql-tools";
import { IEnvConfig } from "utils/env-config";

function makeGraphqlRouter(envConfig: IEnvConfig) {
  const router = express.Router();
  const schema = makeExecutableSchema({
    resolvers: graphqlResolvers,
    typeDefs: graphqlTypes
  });
  router.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress((req, res) => {
      return { schema, context: { req, res } };
    })
  );

  if (envConfig.isDevEnv) {
    router.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
  }

  return router;
}

export { makeGraphqlRouter };
