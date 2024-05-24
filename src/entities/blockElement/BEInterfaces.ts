import { LEAF_BE_TAGS, RECURSIVE_BE_TAGS } from '@/common/enums';
import { DOBaseBlockElement } from './DOBaseBlockElement';
import { DOHeadingBE } from './DOHeadingBE';
import { DOTextBE } from './DOTextBE';
import { DORootBE } from './DORootBE';
import { DOContainerBE } from './DOContainerBE';

export type BE_TAGS = LEAF_BE_TAGS | RECURSIVE_BE_TAGS;
export type BE_CONTENTS =
  | IHeadingBEContents
  | ITextBEContents
  | ILeafBEContents
  | IRecursiveBEContents;
export type DO_BE = DOHeadingBE | DOTextBE | DORootBE | DOContainerBE;
export type DOBaseBE = DOBaseBlockElement<BE_TAGS, BE_CONTENTS>;
export type IDOBaseBE = IDOBaseBlockElement<BE_TAGS, BE_CONTENTS>;

export interface IDOHeadingBE extends IDOLeafBE<ILeafBEContents> {
  contents: IHeadingBEContents;
}

export interface IDOTextBE extends IDOLeafBE<ILeafBEContents> {
  contents: ITextBEContents;
}

export interface IDORootBE extends IDORecursiveBE<IRecursiveBEContents> {}

export interface IDOContainerBE extends IDORecursiveBE<IRecursiveBEContents> {}

export interface IDOBaseBlockElement<
  TAG_TYPE extends BE_TAGS,
  CONTENTS_TYPE extends BE_CONTENTS
> {
  id: string;
  tag: TAG_TYPE;
  parentId: string;
  contents: CONTENTS_TYPE;
  style?: React.CSSProperties;
}

export interface IDOLeafBE<CONTENTS_TYPE extends ILeafBEContents>
  extends IDOBaseBlockElement<LEAF_BE_TAGS, CONTENTS_TYPE> {}

export interface IDORecursiveBE<CONTENTS_TYPE extends IRecursiveBEContents>
  extends IDOBaseBlockElement<RECURSIVE_BE_TAGS, CONTENTS_TYPE> {
  contents: CONTENTS_TYPE;
}

export interface IHeadingBEContents extends ILeafBEContents {
  innerText: string;
}

export interface ITextBEContents extends ILeafBEContents {
  innerText: string;
}

export interface IContainerBEContents extends IRecursiveBEContents {}

export interface IRootBEContents extends IRecursiveBEContents {}

export interface ILeafBEContents {}

export interface IRecursiveBEContents {
  childrenIds: string[];
}
