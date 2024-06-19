import _ from 'lodash';
import ShortUniqueId from 'short-unique-id';

export const Utils = {
  _: _,

  createUniqueId: (length: number) => new ShortUniqueId({ length }).rnd(),

  deepFreeze: <T extends { [key: string]: any }>(obj: T): T => {
    if (obj && typeof obj === 'object') {
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach((prop) =>
        Utils.deepFreeze(obj[prop])
      );
    }

    return obj;
  },
};
