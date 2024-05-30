import { IDOBaseBE } from '../blockElement/BEInterfaces';
import { IDOPage } from './PageInterfaces';

export class DOPage implements IDOPage {
  id: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  title: string;
  blockElements: IDOBaseBE[];

  constructor(data: IDOPage) {
    this.id = data.id;
    this.documentId = data.documentId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.order = data.order;
    this.title = data.title ?? 'Untitled';
    this.blockElements = data.blockElements ?? [];
  }
}
