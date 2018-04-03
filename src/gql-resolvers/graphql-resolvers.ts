import graphqlMutations from "gql-resolvers/graphql-mutations";
import graphqlQueries from "gql-resolvers/graphql-queries";
import userResolver from "gql-resolvers/user-resolver";

const graphqlResolvers = {
  Mutation: graphqlMutations,
  Query: graphqlQueries,
  User: userResolver
};

export default graphqlResolvers;
