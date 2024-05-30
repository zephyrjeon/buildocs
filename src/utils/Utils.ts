export const Utils = {
  URLs: {
    rootURL: '/buildocs',
    documentsURL: '/buildocs/documents',
    pagesURL: (documentId: string, pageId: string) =>
      `${Utils.URLs.documentsURL}/${documentId}/pages/${pageId}`,
  },

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
