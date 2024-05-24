export enum LEAF_BE_TAGS {
  HEADING = 'HEADING',
  TEXT = 'TEXT',
  // CODE = 'CODE',
  // IMAGE = 'IMAGE',
  // LINK = 'LINK',
}

export enum RECURSIVE_BE_TAGS {
  //
  // TOGGLE = 'TOGGLE',
  // BULLETED_LIST = 'BULLETED_LIST',
  // NUMBERED_LIST = 'NUMBERED_LIST',
  //
  ROOT = 'ROOT',
  CONTAINER_ROW = 'CONTAINER_ROW',
  CONTAINER_COLUMN = 'CONTAINER_COLUMN',
}

export const APP_ENUMS = {
  BE_TAGS: { ...LEAF_BE_TAGS, ...RECURSIVE_BE_TAGS },
  LEAF_BE_TAGS: LEAF_BE_TAGS,
  RECURSIVE_BE_TAGS: RECURSIVE_BE_TAGS,
};
