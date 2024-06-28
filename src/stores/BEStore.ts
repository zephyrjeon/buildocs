import {
  DO_BE,
  IDOBaseBE,
  IDOContainerBE,
  IDOHeadingBE,
  IDOListableBE,
  IDORecursiveBE,
  IDORootBE,
  IDOTextBE,
  IRecursiveBEContents,
} from '@/entities/blockElement/BEInterfaces';
import { DOBaseBlockElement } from '@/entities/blockElement/DOBaseBlockElement';
import { DOContainerBE } from '@/entities/blockElement/DOContainerBE';
import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import { DORootBE } from '@/entities/blockElement/DORootBE';
import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import { create } from 'zustand';
import { RootStore } from './RootStore';

export enum BE_RELATIONS {
  SELF = 'SELF',
  CHILDREN = 'CHILDREN',
  PARENT = 'PARENT',
  NONE = 'NONE',
}

enum SET_STATE_ACTIONS {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

interface IState {
  [id: string]: DO_BE;
}

export class BEStore {
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

  private setState(action: SET_STATE_ACTIONS, BE: DO_BE) {
    switch (action) {
      case SET_STATE_ACTIONS.ADD:
        if (this.getBEById(BE.id) === BE)
          throw new Error('Must not be a existing BE instance to be set');

        return this.state.setState((state) => ({ ...state, [BE.id]: BE }));

      case SET_STATE_ACTIONS.REMOVE:
        return this.state.setState((state) => {
          delete state[BE.id];
          return { ...state };
        });
    }
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  get useGetRootBE(): DORootBE {
    return this.useState['root'] as DORootBE;
  }

  get useGetBEs() {
    return this.useState;
  }

  useGetBEById(id: string) {
    return this.useState[id];
  }

  getBEById(id: string) {
    return this.getState[id];
  }

  getParentBE(BE: DO_BE) {
    if (this.getRootBE.id === BE.id)
      throw new Error('Cannot get parentBE of rootBE');

    const parent = this.getBEById(BE.parentId);

    if (this.BETypeGuards.isRecursive(parent)) {
      return parent;
    } else {
      throw new Error('ParentBE must be a recursive BE');
    }
  }

  get getRootBE(): DORootBE {
    return (
      (this.getState['root'] as DORootBE) ??
      Object.values(this.getState).find((BE) => BE.parentId === 'page')
    );
  }

  setBE(BE: DO_BE | IDOBaseBE) {
    if (BE instanceof DOBaseBlockElement) {
      this.setState(SET_STATE_ACTIONS.ADD, BE);
      return BE;
    } else {
      const DOBE = this.instantiateDO(BE);
      this.setState(SET_STATE_ACTIONS.ADD, DOBE);
      return DOBE;
    }
  }

  removeBE(id: string) {
    this.setState(SET_STATE_ACTIONS.REMOVE, this.getBEById(id));
  }

  parseBEs(rawData: string) {
    const jsonParsed: IDOBaseBE[] = JSON.parse(rawData);

    jsonParsed.map((BE) => this.setBE(this.instantiateDO(BE)));
  }

  instantiateDO(BE: IDOBaseBE) {
    switch (BE.tag) {
      case this.rootStore.enums.BE_TAGS.ROOT:
        return this.rootStore.di.utils.deepFreeze(
          new DORootBE(BE as IDORootBE)
        );
      case this.rootStore.enums.BE_TAGS.HEADING:
        return this.rootStore.di.utils.deepFreeze(
          new DOHeadingBE(BE as IDOHeadingBE)
        );
      case this.rootStore.enums.BE_TAGS.TEXT:
        return this.rootStore.di.utils.deepFreeze(
          new DOTextBE(BE as IDOTextBE)
        );

      case this.rootStore.enums.BE_TAGS.CONTAINER_ROW:
        return this.rootStore.di.utils.deepFreeze(
          new DOContainerBE(BE as IDOContainerBE)
        );
      case this.rootStore.enums.BE_TAGS.CONTAINER_COLUMN:
        return this.rootStore.di.utils.deepFreeze(
          new DOContainerBE(BE as IDOContainerBE)
        );
      case this.rootStore.enums.BE_TAGS.TOGGLE_HEADING_LIST:
      case this.rootStore.enums.BE_TAGS.TOGGLE_LIST:
      case this.rootStore.enums.BE_TAGS.BULLETED_LIST:
      case this.rootStore.enums.BE_TAGS.NUMBERED_LIST:
        return this.rootStore.di.utils.deepFreeze(
          new DOListableBE(BE as IDOListableBE)
        );

      default:
        throw new Error('Unregistered BE tag');
    }
  }

  getRelationOf(BE: DO_BE, towards: DO_BE) {
    if (BE.id === towards.id) return BE_RELATIONS.SELF;

    // is BE1 children of BE2
    const isChildren = (BE1: DO_BE, BE2: DO_BE) => {
      if (BE1.id === BE2.id) return true;

      if (this.BETypeGuards.isRecursive(BE2)) {
        const index = BE2.contents.childrenIds.findIndex((id) =>
          isChildren(BE1, this.getBEById(id))
        );

        if (index > -1) return true;
      }
    };

    if (isChildren(BE, towards)) return BE_RELATIONS.CHILDREN;

    // is BE1 parent of BE2
    const isParent = (BE1: DO_BE, BE2: DO_BE) => {
      if (BE1.id === BE2.id) return true;

      const parent = this.getBEById(BE2.parentId);

      if (!!parent && isParent(BE1, parent)) return true;
    };

    if (isParent(BE, towards)) return BE_RELATIONS.PARENT;

    return BE_RELATIONS.NONE;
  }

  BETypeGuards = {
    isRecursive: (BE: DO_BE): BE is IDORecursiveBE<IRecursiveBEContents> => {
      return BE.contents.hasOwnProperty('childrenIds');
    },
    isListable: (BE: DO_BE): BE is IDOListableBE => {
      return (
        BE.tag === this.rootStore.enums.BE_TAGS.TOGGLE_HEADING_LIST ||
        BE.tag === this.rootStore.enums.BE_TAGS.TOGGLE_LIST ||
        BE.tag === this.rootStore.enums.BE_TAGS.NUMBERED_LIST ||
        BE.tag === this.rootStore.enums.BE_TAGS.BULLETED_LIST
      );
    },
    narrowToRecursive: (
      BE: DO_BE
    ): IDORecursiveBE<IRecursiveBEContents> | null => {
      if (this.BETypeGuards.isRecursive(BE)) {
        return BE;
      } else {
        return null;
      }
    },
  };
}
