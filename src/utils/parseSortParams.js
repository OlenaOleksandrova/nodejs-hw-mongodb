export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';
  const sortBy = ['name', 'phoneNumber', 'email', 'contactType'].includes(
    query.sortBy,
  )
    ? query.sortBy
    : '_id';

  return {
    sortOrder,
    sortBy,
  };
};
