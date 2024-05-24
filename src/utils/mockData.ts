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

const mockPage1 = {
  id: 'page1',
  be: mockBEData1,
};
