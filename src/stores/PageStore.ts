import { DOPage } from '@/entities/page/DOPage';
import { create } from 'zustand';
import { RootStore } from './RootStore';

enum SET_STATE_ACTIONS {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

interface IState {
  [id: string]: DOPage;
}

export class PageStore {
  private rootStore: RootStore;

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

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}
