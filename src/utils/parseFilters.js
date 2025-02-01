const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const trimmedValue = value.trim().toLowerCase();
  if (trimmedValue === 'true') {
    return true;
  } else if (trimmedValue === 'false') {
    return false;
  }
};

export const parseFilters = (query) => {
  return {
    type: query?.type ? parseContactType(query.type) : undefined,
    // isFavourite: parseBoolean(filter.isFavourite),
    isFavourite:
      query?.isFavourite !== undefined
        ? parseBoolean(query.isFavourite)
        : undefined,
  };
};
