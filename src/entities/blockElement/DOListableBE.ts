import { IDOListableBE, IListableBEContents } from './BEInterfaces';
import { DORecursiveBE } from './DOBaseBlockElement';

export class DOListableBE extends DORecursiveBE<IListableBEContents> {
  constructor(data: IDOListableBE) {
    super(data);
  }
}
