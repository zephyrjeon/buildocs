import { IDOPage } from '../page/PageInterfaces';
import { IDODocument } from './DocumentInterfaces';

export class DODocument implements IDODocument {
  id: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  title?: string | undefined;
  pages: IDOPage[];

  constructor(data: IDODocument) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.order = data.order;
    this.title = data.title ?? 'Untitled';
    this.pages = data.pages ?? [];
  }
}
