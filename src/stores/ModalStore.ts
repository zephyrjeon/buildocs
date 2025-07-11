import { RootStore } from './RootStore';
import { create } from 'zustand';

type SigninStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export class ModalStore {
  rootStore: RootStore;

  useSignin = create<SigninStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }));

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}
