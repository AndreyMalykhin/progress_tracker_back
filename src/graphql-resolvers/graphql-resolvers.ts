import graphqlMutations from "graphql-resolvers/graphql-mutations";
import graphqlQueries from "graphql-resolvers/graphql-queries";

const graphqlResolvers = {
  Mutation: graphqlMutations,
  Query: graphqlQueries
};

export default graphqlResolvers;
