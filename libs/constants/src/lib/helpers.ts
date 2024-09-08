import { camelCase, mapKeys } from 'lodash';

export const objToCamelCase = (obj: any) =>
  mapKeys(obj, (v, key) => camelCase(key));

export const getTokenExpirationTime = (expires: number) => {
  return Date.now() + expires * 1000;
}
