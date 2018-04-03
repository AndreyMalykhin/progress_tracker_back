import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import graphqlResolvers from "gql-resolvers/graphql-resolvers";
import graphqlTypes from "gql-schema/graphql-types";
import { makeExecutableSchema } from "graphql-tools";
import { makeAuthMiddleware } from "utils/auth-middleware";
import DIContainer from "utils/di-container";
import IGraphqlContext from "utils/graphql-context";

function makeGraphqlRouter(diContainer: DIContainer) {
  const router = express.Router();
  const schema = makeExecutableSchema({
    resolvers: graphqlResolvers,
    typeDefs: graphqlTypes
  });
  const { isDevEnv } = diContainer.envConfig;
  const isTerminating = false;
  router.use(
    "/graphql",
    bodyParser.json(),
    makeAuthMiddleware(diContainer, isTerminating),
    graphqlExpress((req, res) => {
      return {
        context: {
          diContainer,
          loaderMap: diContainer.loaderMapFactory(),
          session: res!.locals.session
        } as IGraphqlContext,
        debug: isDevEnv,
        schema,
        tracing: isDevEnv
      };
    })
  );

  if (isDevEnv) {
    router.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
        variables: { accessToken: "" }
      })
    );
  }

  return router;
}

export { makeGraphqlRouter };
