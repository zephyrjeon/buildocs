import { LEAF_BE_TAGS, RECURSIVE_BE_TAGS } from '@/common/enums';
import _ from 'lodash';
import {
  BE_CONTENTS,
  BE_TAGS,
  IDOBaseBlockElement,
  IDOLeafBE,
  IDORecursiveBE,
  ILeafBEContents,
  IRecursiveBEContents,
} from './BEInterfaces';

export abstract class DOBaseBlockElement<
  TAG_TYPE extends BE_TAGS,
  CONTENTS_TYPE extends BE_CONTENTS
> implements IDOBaseBlockElement<TAG_TYPE, CONTENTS_TYPE>
{
  id: string;
  tag: TAG_TYPE;
  parentId: string;
  contents: CONTENTS_TYPE;
  style?: React.CSSProperties;

  constructor(data: IDOBaseBlockElement<TAG_TYPE, CONTENTS_TYPE>) {
    this.id = data.id;
    this.tag = data.tag;
    this.parentId = data.parentId;
    this.contents = _.cloneDeep(data.contents);
    this.style = _.cloneDeep(data.style);
  }
}

export abstract class DOLeafBE<CONTENTS_TYPE extends ILeafBEContents>
  extends DOBaseBlockElement<LEAF_BE_TAGS, CONTENTS_TYPE>
  implements IDOLeafBE<CONTENTS_TYPE>
{
  constructor(data: IDOLeafBE<CONTENTS_TYPE>) {
    super(data);
  }
}

export abstract class DORecursiveBE<CONTENTS_TYPE extends IRecursiveBEContents>
  extends DOBaseBlockElement<RECURSIVE_BE_TAGS, CONTENTS_TYPE>
  implements IDORecursiveBE<CONTENTS_TYPE>
{
  constructor(data: IDORecursiveBE<CONTENTS_TYPE>) {
    super(data);
  }
}
