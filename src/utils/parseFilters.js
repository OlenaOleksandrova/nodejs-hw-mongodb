import { parseNumber } from './parseNumber.js';

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

export const parseFilters = (filter) => {
  return {
    type: parseContactType(filter.type),
    isFavourite: parseBoolean(filter.isFavourite),
  };
};
