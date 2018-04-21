function makeConnection<TItem, TCursor = string | number>(
  items: TItem[],
  getCursor: (item: TItem) => TCursor,
  itemsPerPage: number
) {
  const pageItems =
    items.length > itemsPerPage ? items.slice(0, itemsPerPage) : items;
  return {
    edges: pageItems.map(item => {
      return {
        cursor: getCursor(item),
        node: item
      };
    }),
    pageInfo: {
      endCursor: pageItems.length
        ? getCursor(pageItems[pageItems.length - 1])
        : null,
      hasNextPage: items.length > itemsPerPage
    }
  };
}

export { makeConnection };
