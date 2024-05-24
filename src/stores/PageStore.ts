import { promises as fs } from 'fs';
import { mockBEData1 } from '@/utils/mockData';
import { RootStore } from './RootStore';
import { create } from 'zustand';

const mockPage1 = {
  id: 'page1',
  be: mockBEData1,
};

interface IDocument {
  id: string;
  userId: string;
  landingPageId: string;
}

interface IPage {
  id: string;
  be: string;
  children: [];
}

interface IDOPage {
  id: string;
  be: string;
}

interface IPageState {
  page: { [id: string]: IPage };
  update: (id: number, newBe: string) => void;
}

export class PageStore {
  private rootStore: RootStore;
  private usePageStore = create<IPageState>()((set, get) => ({
    page: {},
    update: (id, newBe) => {
      set((state) => ({ ...state, [id]: newBe }));
    },
  }));

  rawData = {
    page1: {
      id: 'page1',
      be: JSON.stringify(mockBEData1),
    },
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  getPageById(id: string) {
    const data = this.usePageStore.getState().page[id].be;
    this.rootStore.BEStore.parseBEs(data);
  }

  // action works!
  update(id: number, newBe: string) {
    this.usePageStore.getState().update(id, newBe);
  }

  // component updated !
  get page() {
    return this.usePageStore().page;
  }
}
