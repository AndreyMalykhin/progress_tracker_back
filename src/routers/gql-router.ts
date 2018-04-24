import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import express, { Response } from "express";
import gqlResolvers from "gql-resolvers/gql-resolvers";
import gqlTypes from "gql-schema/gql-types";
import { IResolvers, makeExecutableSchema } from "graphql-tools";
import { makeAuthMiddleware } from "utils/auth-middleware";
import ConstraintViolationError from "utils/constraint-violation-error";
import DIContainer from "utils/di-container";
import IGqlContext from "utils/gql-context";
import handleError from "utils/handle-error";
import { makeLog } from "utils/log";

const log = makeLog("gql-router");

function makeGqlRouter(diContainer: DIContainer) {
  const router = express.Router();
  const schema = makeExecutableSchema({
    resolvers: gqlResolvers,
    typeDefs: gqlTypes
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
        } as IGqlContext,
        debug: isDevEnv,
        formatError: (error: any) =>
          handleError(error, diContainer.envConfig, res!),
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

export { makeGqlRouter };
