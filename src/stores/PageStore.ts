import { DOPage } from '@/entities/page/DOPage';
import { IDOPage } from '@/entities/page/PageInterfaces';
import { Utils } from '@/utils/Utils';
import ShortUniqueId from 'short-unique-id';
import { create } from 'zustand';
import { RootStore } from './RootStore';

enum SET_STATE_ACTIONS {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  REMOVE_DOCUMENT = 'REMOVE_DOCUMENT',
}

interface IState {
  [documentId: string]: DOPage[];
}

export class PageStore {
  rootStore: RootStore;

  // Do not access Zustand state direclty, use useState, getState or setState methods to access state
  private state = create<IState>()(() => ({}));

  // This is a react hook. When state updated, rerender tirggered by Zustand. Use these use[...] methods only for UI
  private get useState() {
    return this.state();
  }

  // Access state without calling a hook
  private get getState() {
    return this.state.getState();
  }

  private setState(action: SET_STATE_ACTIONS, page: DOPage) {
    switch (action) {
      case SET_STATE_ACTIONS.ADD:
        return this.state.setState((state) => {
          const prev = state[page.documentId];

          if (prev) {
            const filtered = prev.filter((p) => p.id !== page.id);
            filtered.push(page);
            return { ...state, [page.documentId]: filtered };
          } else {
            return { ...state, [page.documentId]: [page] };
          }
        });

      case SET_STATE_ACTIONS.REMOVE:
        return this.state.setState((state) => {
          const prev = state[page.documentId];
          const filtered = prev.filter((p) => p.id !== page.id);

          return { ...state, [page.documentId]: filtered };
        });
    }
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  usePagesByDocumentId(documentId: string) {
    return this.useState[documentId] ?? [];
  }

  getPagesByDocumentId(documentId: string) {
    return this.getState[documentId] ?? [];
  }

  getPageById(pageId: string, documentId: string) {
    const page = this.getPagesByDocumentId(documentId).find(
      (page) => page.id === pageId
    );
    if (!page) throw new Error('Page is not found');
    return page;
  }

  add(page: DOPage | IDOPage) {
    if (page instanceof DOPage) {
      this.setState(SET_STATE_ACTIONS.ADD, page);
    } else {
      this.setState(SET_STATE_ACTIONS.ADD, this.instantiateDO(page));
    }

    return this.getPageById(page.id, page.documentId);
  }

  create(documentId: string) {
    // TODO server api call
    const newPage: IDOPage = {
      id: new ShortUniqueId({ length: 10 }).rnd(),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: this.getState[documentId]?.length ?? 0,
      documentId,
    };

    return this.add(newPage);
  }

  // remove(page: DOPage) {
  //   // TODO move page to archive
  //   // TODO server api call
  //   this.setState(SET_STATE_ACTIONS.REMOVE, page);
  //   // remove new page from document.pages
  // }

  // rename(page: DOPage, newTitle: string) {
  //   const newPage = _.cloneDeep(page);
  //   newPage.title = newTitle;
  //   this.setState(SET_STATE_ACTIONS.ADD, this.instantiateDO(newPage));
  // }

  instantiateDO(data: IDOPage) {
    return Utils.deepFreeze(new DOPage(this, data));
  }
}
