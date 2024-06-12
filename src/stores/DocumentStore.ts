import { DODocument } from '@/entities/document/DODocument';
import { IDODocument } from '@/entities/document/DocumentInterfaces';
import { Utils } from '@/utils/Utils';
import { mockMyDocuments } from '@/utils/mockData';
import _ from 'lodash';
import ShortUniqueId from 'short-unique-id';
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
      id: new ShortUniqueId({ length: 10 }).rnd(),
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
  }

  rename(document: DODocument, newTitle: string) {
    const newDocument = _.cloneDeep(document);
    newDocument.title = newTitle;
    const newDODocument = this.instantiateDO(newDocument);
    this.setState(SET_STATE_ACTIONS.ADD, newDODocument);
  }

  addNewPage(documentId: string) {
    return this.rootStore.pageStore.create(documentId);
  }

  removePage(page: DOPage) {
    return this.rootStore.pageStore.remove(page);
  }

  update() {}

  instantiateDO(data: IDODocument) {
    return Utils.deepFreeze(new DODocument(this, data));
  }
}
