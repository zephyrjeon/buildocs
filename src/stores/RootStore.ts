import { create } from 'zustand';
import { BEStore } from './BEStore';
import { PageStore } from './PageStore';
import { BEEditorStore } from './BEEditorStore';
import React from 'react';

export class RootStore {
  BEStore = new BEStore(this);
  BEEditStore = new BEEditorStore(this);
  pageStore = new PageStore(this);

  log(msg: string) {
    console.log(`RootStore msg: ${msg}`);
  }

  constructor() {}
}

export const rootStore = new RootStore();
export const RootStoreContext = React.createContext(rootStore);
export const useStore = () => React.useContext(RootStoreContext);
