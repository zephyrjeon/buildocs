import { IDOHeadingBE, IHeadingBEContents } from './BEInterfaces';
import { DOLeafBE } from './DOBaseBlockElement';

export class DOHeadingBE extends DOLeafBE<IHeadingBEContents> {
  constructor(data: IDOHeadingBE) {
    super(data);
  }
}
