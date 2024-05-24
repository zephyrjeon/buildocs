import { IDOBaseBlockElement, BE_TAGS } from '../blockElement/BEInterfaces';
import { IDOPage } from './PageInterfaces';

export class DOPag implements IDOPage {
  id: string;
  name: string;
  blockElements: IDOBaseBlockElement<BE_TAGS>[];

  constructor(data: IDOPage) {
    this.id = data.id;
    this.name = data.name ?? 'Untitled';
    this.blockElements = data.blockElements;
  }
}
