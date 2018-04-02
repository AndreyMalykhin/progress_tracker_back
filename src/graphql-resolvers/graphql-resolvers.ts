import graphqlMutations from "graphql-resolvers/graphql-mutations";
import graphqlQueries from "graphql-resolvers/graphql-queries";
import userResolver from "graphql-resolvers/user-resolver";

const graphqlResolvers = {
  Mutation: graphqlMutations,
  Query: graphqlQueries,
  User: userResolver
};

export default graphqlResolvers;
