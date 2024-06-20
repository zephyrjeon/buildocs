import { AppDI } from '@/di/AppDI';
import React from 'react';
import { BEEditorStore } from './BEEditorStore';
import { BEStore } from './BEStore';
import { DocumentStore } from './DocumentStore';
import { PageStore } from './PageStore';
import { APP_OPTIONS, I_APP_OPTIONS } from '@/di/AppOptions';

export class RootStore {
  di: AppDI;
  options: I_APP_OPTIONS;

  BEStore = new BEStore(this);
  BEEditStore = new BEEditorStore(this);
  pageStore = new PageStore(this);
  documentStore = new DocumentStore(this);

  constructor(di: AppDI, options: I_APP_OPTIONS) {
    this.di = di;
    this.options = options;
  }

  get urls() {
    return this.di.urls;
  }

  get enums() {
    return this.di.enums;
  }

  log(msg: string) {
    console.log(`RootStore msg: ${msg}`);
  }
}

export const rootStore = new RootStore(new AppDI(), APP_OPTIONS);
export const RootStoreContext = React.createContext(rootStore);
export const useStore = () => React.useContext(RootStoreContext);
