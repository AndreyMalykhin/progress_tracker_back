function makeConnection<TItem, TCursor = string | number>(
  list: TItem[],
  getCursor: (item: TItem) => TCursor,
  getNextPage: (endCursor: TCursor) => Promise<TItem[]>
) {
  const endCursor = list.length ? getCursor(list[list.length - 1]) : null;
  return {
    edges: list.map(item => {
      return {
        cursor: getCursor(item),
        node: item
      };
    }),
    pageInfo: {
      endCursor,
      hasNextPage: async () =>
        endCursor ? (await getNextPage(endCursor)).length > 0 : false
    }
  };
}

export { makeConnection };
