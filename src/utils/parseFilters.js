import { parseNumber } from './parseNumber.js';

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
  // if (string === 'true') return true;
  // if (string === 'false') return false;
  // return undefined;
};

export const parseFilters = (filter) => {
  return {
    type: parseBoolean(filter.type),
    isFavourite: parseBoolean(filter.isFavourite),
  };
};
