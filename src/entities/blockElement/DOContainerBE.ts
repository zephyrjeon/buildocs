import { IContainerBEContents, IDOContainerBE } from './BEInterfaces';
import { DORecursiveBE } from './DOBaseBlockElement';

export class DOContainerBE extends DORecursiveBE<IContainerBEContents> {
  constructor(data: IDOContainerBE) {
    super(data);
  }
}
