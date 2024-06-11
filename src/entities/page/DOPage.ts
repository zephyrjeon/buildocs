import { PageStore } from '@/stores/PageStore';
import { IDOPage } from './PageInterfaces';

export class DOPage implements IDOPage {
  id: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  order: number;
  title: string;

  constructor(store: PageStore, data: IDOPage) {
    this.id = data.id;
    this.documentId = data.documentId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
    this.order = data.order;
    this.title = data.title ?? 'Untitled';
  }
}
