import { IDOPage } from '../page/PageInterfaces';

export interface IDODocument {
  id: string;
  authorId: string;
  title?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  pages: IDOPage[];
}
