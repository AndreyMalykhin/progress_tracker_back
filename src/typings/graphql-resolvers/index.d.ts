declare module "graphql-resolvers" {
  type IResolver<TArgs extends {}, TContext extends {}> = (
    parentValue: any,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ) => any;

  declare function combineResolvers<TSource, TContext>(
    ...resolvers: IResolver[]
  ): IResolver;

  export { combineResolvers };
}
