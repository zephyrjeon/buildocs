import { BE_TAGS, IDOBaseBlockElement } from '../blockElement/BEInterfaces';

export interface IDOPage {
  id: string;
  name?: string;
  blockElements: IDOBaseBlockElement<BE_TAGS>[];
}
