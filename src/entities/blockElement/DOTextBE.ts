import { IDOTextBE, ITextBEContents } from './BEInterfaces';
import { DOLeafBE } from './DOBaseBlockElement';

export class DOTextBE extends DOLeafBE<ITextBEContents> {
  constructor(data: IDOTextBE) {
    super(data);
  }
}
