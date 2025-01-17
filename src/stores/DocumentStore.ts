import { DODocument } from '@/entities/document/DODocument';
import { IDODocument } from '@/entities/document/DocumentInterfaces';
import { mockMyDocuments } from '@/utils/mockData';
import { create } from 'zustand';
import { RootStore } from './RootStore';
import { DOPage } from '@/entities/page/DOPage';

enum SET_STATE_ACTIONS {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

interface IState {
  myDocumentList: DODocument[];
}

export class DocumentStore {
  rootStore: RootStore;

  // Do not access Zustand state direclty, use useState, getState or setState methods to access state
  private state = create<IState>()(() => ({ myDocumentList: [] }));

  // This is a react hook. When state updated, rerender tirggered by Zustand. Use these use[...] methods only for UI
  private get useState() {
    return this.state();
  }

  // Access state without calling a hook
  private get getState() {
    return this.state.getState();
  }

  private setState(action: SET_STATE_ACTIONS, document: DODocument) {
    switch (action) {
      case SET_STATE_ACTIONS.ADD:
        return this.state.setState((state) => {
          const filtered = state.myDocumentList.filter(
            (docu) => docu.id !== document.id
          );
          filtered.push(document);
          filtered.sort((a, b) => a.order - b.order);
          return { ...state, myDocumentList: filtered };
        });

      case SET_STATE_ACTIONS.REMOVE:
        return this.state.setState((state) => {
          const filtered = state.myDocumentList.filter(
            (docu) => docu.id !== document.id
          );
          return { ...state, myDocumentList: filtered };
        });
    }
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  get useMyDocumentList() {
    return this.useState.myDocumentList;
  }

  get getMyDocumentList() {
    return this.getState.myDocumentList;
  }

  getMyDocumentById(documentId: string) {
    const document = this.getState.myDocumentList.find(
      (doc) => doc.id === documentId
    );
    if (!document) throw new Error('Document not found');
    return document;
  }

  loadMyDocumentList() {
    mockMyDocuments.forEach((docu) => {
      this.setState(SET_STATE_ACTIONS.ADD, this.instantiateDO(docu));
    });
  }

  create() {
    // TODO server api call
    const newDocument: IDODocument = {
      id: this.rootStore.di.utils.createUniqueId(
        this.rootStore.options.SHORT_UNIQUE_ID_LENGTH
      ),
      authorId: 'userId',
      createdAt: new Date(),
      updatedAt: new Date(),
      order: this.getState.myDocumentList.length,
      pages: [],
    };

    const DODocument = this.instantiateDO(newDocument);
    this.setState(SET_STATE_ACTIONS.ADD, DODocument);
  }

  remove(document: DODocument) {
    // TODO move pages to deleted pages and permernantly delete document
    // TODO server api call
    this.rootStore.pageStore.removeAll(document.pages);
    this.setState(SET_STATE_ACTIONS.REMOVE, document);

    if (this.getMyDocumentList.length > 0) {
      this.reorder(this.getMyDocumentList[0], 0);
    }
  }

  rename(document: DODocument, newTitle: string) {
    const newDocument = this.rootStore.di.utils._.cloneDeep(document);
    newDocument.title = newTitle;
    const newDODocument = this.instantiateDO(newDocument);
    this.setState(SET_STATE_ACTIONS.ADD, newDODocument);
  }

  reorder(document: DODocument, newOrder: number) {
    const documents = this.getMyDocumentList;
    const filtered = documents.filter((doc) => doc.id !== document.id);
    newOrder = Math.max(Math.min(documents.length, newOrder), 0);
    filtered.splice(newOrder, 0, document);

    filtered.forEach((doc, index) => {
      if (doc.order != index) {
        const cloned = this.rootStore.di.utils._.cloneDeep(doc);
        cloned.order = index;
        this.setState(SET_STATE_ACTIONS.ADD, this.instantiateDO(cloned));
      }
    });
  }

  addNewPage(documentId: string) {
    return this.rootStore.pageStore.create(documentId);
  }

  removePage(page: DOPage) {
    return this.rootStore.pageStore.remove(page);
  }

  update() {}

  instantiateDO(data: IDODocument) {
    return this.rootStore.di.utils.deepFreeze(new DODocument(this, data));
  }
}
