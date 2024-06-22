import { APP_ENUMS } from '@/common/enums';
import { IDOBaseBE } from '@/entities/blockElement/BEInterfaces';
import { IDOPage } from '@/entities/page/PageInterfaces';

export const mockBEData1: IDOBaseBE[] = [
  {
    id: 'root',
    tag: APP_ENUMS.BE_TAGS.ROOT,
    parentId: 'page',
    contents: {
      childrenIds: ['be1', 'be2', 'be4', 'be6'],
    },
  },
  {
    id: 'be1',
    tag: APP_ENUMS.BE_TAGS.HEADING,
    parentId: 'root',
    contents: {
      innerText: 'heading 1',
    },
  },
  {
    id: 'be2',
    tag: APP_ENUMS.BE_TAGS.CONTAINER_ROW,
    parentId: 'root',
    contents: {
      childrenIds: ['be3'],
    },
  },
  {
    id: 'be3',
    tag: APP_ENUMS.BE_TAGS.TEXT,
    parentId: 'be2',
    contents: {
      innerText: `test text1`,
    },
  },
  {
    id: 'be4',
    tag: APP_ENUMS.BE_TAGS.CONTAINER_COLUMN,
    parentId: 'root',
    contents: {
      childrenIds: ['be5'],
    },
  },
  {
    id: 'be5',
    tag: APP_ENUMS.BE_TAGS.TEXT,
    parentId: 'be4',
    contents: {
      innerText: `Drag and Drop me`,
    },
  },
  {
    id: 'be6',
    tag: APP_ENUMS.BE_TAGS.TOGGLE_HEADING_LIST,
    parentId: 'root',
    contents: {
      childrenIds: ['be7'],
      innerText: `be6 inner text`,
    },
  },
  {
    id: 'be7',
    tag: APP_ENUMS.BE_TAGS.TOGGLE_LIST,
    parentId: 'be6',
    contents: {
      childrenIds: ['be8', 'be9', 'be10'],
      innerText: `be7 inner text`,
    },
  },
  {
    id: 'be8',
    tag: APP_ENUMS.BE_TAGS.NUMBERED_LIST,
    parentId: 'be7',
    contents: {
      childrenIds: ['be11', 'be12', 'be13'],
      innerText: `be8 inner text`,
    },
  },
  {
    id: 'be9',
    tag: APP_ENUMS.BE_TAGS.NUMBERED_LIST,
    parentId: 'be7',
    contents: {
      childrenIds: [],
      innerText: `be9 inner text`,
    },
  },
  {
    id: 'be10',
    tag: APP_ENUMS.BE_TAGS.NUMBERED_LIST,
    parentId: 'be7',
    contents: {
      childrenIds: [],
      innerText: `be10 inner text`,
    },
  },
  {
    id: 'be11',
    tag: APP_ENUMS.BE_TAGS.BULLETED_LIST,
    parentId: 'be8',
    contents: {
      childrenIds: [],
      innerText: `be11 inner text`,
    },
  },
  {
    id: 'be12',
    tag: APP_ENUMS.BE_TAGS.BULLETED_LIST,
    parentId: 'be8',
    contents: {
      childrenIds: [],
      innerText: `be12 inner text`,
    },
  },
  {
    id: 'be13',
    tag: APP_ENUMS.BE_TAGS.BULLETED_LIST,
    parentId: 'be8',
    contents: {
      childrenIds: [],
      innerText: `be13 inner text`,
    },
  },
];

export const mockPage1: IDOPage = {
  id: 'page1',
  documentId: 'docu1',
  title: 'mockPage1 title',
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  // blockElements: mockBEData1,
};

export const mockPage2 = {
  id: 'page2',
  documentId: 'docu1',
  title: 'mockPage2 title',
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  // blockElements: [],
};

export const mockPage3 = {
  id: 'page3',
  documentId: 'docu1',
  title: 'mockPage3 title',
  order: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  // blockElements: [],
};

export const mockPage4 = {
  id: 'page4',
  documentId: 'docu2',
  title: 'mockPage4 title',
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  // blockElements: [],
};

export const mockPages = [mockPage1, mockPage2, mockPage3];

export const mockDocument1 = {
  id: 'docu1',
  authorId: 'userid1',
  title: 'My first document',
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  pages: mockPages,
};

export const mockDocument2 = {
  id: 'docu2',
  authorId: 'userid1',
  title: 'My second document',
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  pages: [mockPage4],
};

export const mockMyDocuments = [mockDocument1, mockDocument2];
