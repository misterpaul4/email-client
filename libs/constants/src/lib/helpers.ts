import { camelCase, mapKeys } from 'lodash';

export const objToCamelCase = (obj: any) =>
  mapKeys(obj, (v, key) => camelCase(key));
