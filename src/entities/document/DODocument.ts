import { DocumentStore } from '@/stores/DocumentStore';
import { DOPage } from '../page/DOPage';
import { IDODocument } from './DocumentInterfaces';

export class DODocument implements IDODocument {
  id: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  title: string;
  pages: DOPage[];

  constructor(store: DocumentStore, data: IDODocument) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.order = data.order;
    this.title = data.title ?? 'Untitled';

    data.pages.map((page) => store.rootStore.pageStore.add(page));
    this.pages = store.rootStore.pageStore.getPagesByDocumentId(data.id);
  }
}
