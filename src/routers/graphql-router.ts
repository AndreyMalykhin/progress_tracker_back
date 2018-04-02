import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import graphqlResolvers from "graphql-resolvers/graphql-resolvers";
import graphqlTypes from "graphql-schema/graphql-types";
import { makeExecutableSchema } from "graphql-tools";
import DIContainer from "utils/di-container";

function makeGraphqlRouter(diContainer: DIContainer) {
  const router = express.Router();
  const schema = makeExecutableSchema({
    resolvers: graphqlResolvers,
    typeDefs: graphqlTypes
  });
  const { isDevEnv } = diContainer.envConfig;
  router.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress((req, res) => {
      return {
        context: { req, res, diContainer },
        debug: isDevEnv,
        schema,
        tracing: isDevEnv
      };
    })
  );

  if (isDevEnv) {
    router.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
  }

  return router;
}

export { makeGraphqlRouter };
