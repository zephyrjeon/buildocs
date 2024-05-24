import { IDORootBE, IRootBEContents } from './BEInterfaces';
import { DORecursiveBE } from './DOBaseBlockElement';

export class DORootBE extends DORecursiveBE<IRootBEContents> {
  constructor(data: IDORootBE) {
    super(data);
  }
}
