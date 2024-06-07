import { IDOBaseBE } from '../blockElement/BEInterfaces';

export interface IDOPage {
  id: string;
  documentId: string;
  title?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
