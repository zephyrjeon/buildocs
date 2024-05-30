import { APP_ENUMS } from '@/common/enums';
import { IDOBaseBE } from '@/entities/blockElement/BEInterfaces';

export const mockBEData1: IDOBaseBE[] = [
  {
    id: 'root',
    tag: APP_ENUMS.BE_TAGS.ROOT,
    parentId: 'page',
    contents: {
      childrenIds: ['be1', 'be2', 'be4'],
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
      innerText: `test\n paragragh\n &lt;span&gt;'g'&lt;/span&gt; paragraph</span>`,
    },
  },
  {
    id: 'be4',
    tag: APP_ENUMS.BE_TAGS.CONTAINER_ROW,
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
      innerText: `test paragragh <span>paragraph2</span> &lt;p&gt;Hi &lt;/p&gt;`,
    },
  },
];

export const mockPage1 = {
  id: 'page1',
  documentId: 'docu1',
  title: 'mockPage1 title',
  order: 0,
  createdAt: '',
  updatedAt: '',
  be: JSON.stringify(mockBEData1),
};

export const mockPage2 = {
  id: 'page2',
  documentId: 'docu1',
  title: 'mockPage2 title',
  order: 1,
  createdAt: '',
  updatedAt: '',
  be: '',
};

export const mockPage3 = {
  id: 'page3',
  documentId: 'docu1',
  title: 'mockPage3 title',
  order: 2,
  createdAt: '',
  updatedAt: '',
  be: '',
};

export const mockPage4 = {
  id: 'page4',
  documentId: 'docu2',
  title: 'mockPage4 title',
  order: 0,
  createdAt: '',
  updatedAt: '',
  be: '',
};

export const mockPages = [mockPage1, mockPage2, mockPage3];

export const mockDocument1 = {
  id: 'docu1',
  authorId: 'userid1',
  title: 'My first document',
  order: 0,
  createdAt: '',
  updatedAt: '',
  pages: mockPages,
};

export const mockDocument2 = {
  id: 'docu2',
  authorId: 'userid1',
  title: 'My second document',
  order: 1,
  createdAt: '',
  updatedAt: '',
  pages: [mockPage4],
};

export const mockMyDocuments = [mockDocument1, mockDocument2];
