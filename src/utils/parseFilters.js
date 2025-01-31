import { parseNumber } from './parseNumber.js';

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

export const parseFilters = (filter) => {
  return {
    type: parseNumber(filter.type),
    isFavourite: parseBoolean(filter.isFavourite),
  };
};
