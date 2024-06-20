import { LEAF_BE_TAGS, RECURSIVE_BE_TAGS } from '@/common/enums';
import { DOBaseBlockElement } from './DOBaseBlockElement';
import { DOHeadingBE } from './DOHeadingBE';
import { DOTextBE } from './DOTextBE';
import { DORootBE } from './DORootBE';
import { DOContainerBE } from './DOContainerBE';
import { DOListableBE } from './DOListableBE';

export type BE_TAGS = LEAF_BE_TAGS | RECURSIVE_BE_TAGS;
export type BE_CONTENTS =
  | ILeafBEContents
  | IRecursiveBEContents
  | IHeadingBEContents
  | ITextBEContents
  | IRootBEContents
  | IContainerBEContents
  | IListableBEContents;
export type DO_BE =
  | DOHeadingBE
  | DOTextBE
  | DORootBE
  | DOContainerBE
  | DOListableBE;
export type DOBaseBE = DOBaseBlockElement<BE_TAGS, BE_CONTENTS>;
export type IDOBaseBE = IDOBaseBlockElement<BE_TAGS, BE_CONTENTS>;

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
  extends IDOBaseBlockElement<RECURSIVE_BE_TAGS, CONTENTS_TYPE> {}

export interface IDOHeadingBE extends IDOLeafBE<IHeadingBEContents> {}

export interface IDOTextBE extends IDOLeafBE<ITextBEContents> {}

export interface IDORootBE extends IDORecursiveBE<IRootBEContents> {}

export interface IDOContainerBE extends IDORecursiveBE<IContainerBEContents> {}

export interface IDOListableBE extends IDORecursiveBE<IListableBEContents> {}

// contents interfaces

export interface ILeafBEContents {}

export interface IRecursiveBEContents {
  childrenIds: string[];
}

export interface IHeadingBEContents extends ILeafBEContents {
  innerText: string;
}

export interface ITextBEContents extends ILeafBEContents {
  innerText: string;
}

export interface IRootBEContents extends IRecursiveBEContents {}

export interface IContainerBEContents extends IRecursiveBEContents {}

export interface IListableBEContents extends IRecursiveBEContents {
  innerText: string;
}
