import {
  BE_CONTENTS,
  BE_TAGS,
  DO_BE,
  IDOBaseBE,
  IDORecursiveBE,
  IRecursiveBEContents,
} from '@/entities/blockElement/BEInterfaces';
import { produce } from 'immer';
import { create } from 'zustand';
import { BE_RELATIONS } from './BEStore';
import { RootStore } from './RootStore';

export enum BE_DROP_POSITION {
  PREV = 'PREV', //  draggingBE is placed as the previous sibling of draggedOverBEState.target
  NEXT = 'NEXT', //  draggingBE is placed as the next sibling of draggedOverBEState.target
  INSIDE = 'INSIDE', //  draggingBE is placed as the last children of draggedOverBEState.target
}

type DraggedOverBEState = {
  target: DO_BE;
  position: BE_DROP_POSITION;
};

interface IState {
  focusedBERef: HTMLElement | null;
  hoveredBE: DO_BE | null;
  draggingBEs: DO_BE[];
  draggedOverBEState: DraggedOverBEState | null;
  isOutlineVisible: boolean;
}

export class BEEditorStore {
  rootStore: RootStore;

  private state = create<IState>()(() => ({
    focusedBERef: null,
    hoveredBE: null,
    draggingBEs: [],
    draggedOverBEState: null,
    isOutlineVisible: false,
  }));

  // This is a react hook. When state updated, rerender tirggered by Zustand. Use these use[...] methods only for UI
  private get useState() {
    return this.state();
  }

  // Access state without calling a hook
  private get getState() {
    return this.state.getState();
  }

  private setState = (input: Partial<IState>) => {
    this.state.setState(produce((state) => ({ ...state, ...input })));
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  get useFocusedBERef() {
    return this.useState.focusedBERef;
  }

  get useHoveredBE() {
    return this.useState.hoveredBE;
  }

  get useDraggedOverBE() {
    return this.useState.draggedOverBEState;
  }

  get useDraggingBEs() {
    return this.useState.draggingBEs;
  }

  get useIsOutlineVisible() {
    return this.useState.isOutlineVisible;
  }

  setFocusedBERef(BE: any) {
    this.setState({ focusedBERef: BE });
  }

  setHoveredBE(BE: DO_BE | null) {
    this.setState({ hoveredBE: BE });
  }

  setDraggingBE(BE: DO_BE | null) {
    // if dragging is children or parent of existing?
    //  currently drag only 1 item. TODO: drag multiple items
    if (!BE) {
      this.setState({ draggingBEs: [] });
    } else {
      this.setState({ draggingBEs: [BE] });
    }
  }

  setDraggedOverBE(data: DraggedOverBEState | null) {
    if (!data) return this.setState({ draggedOverBEState: null });

    // Do not allow to set when draggedOverBE is leafBE and dropPosition is INSIDE
    const isRecursive = this.rootStore.BEStore.BETypeGuards.isRecursive(
      data.target
    );

    if (!isRecursive && data.position === BE_DROP_POSITION.INSIDE) {
      return this.setState({ draggedOverBEState: null });
    }

    // DO not allow to set when draggedOverBE is itself or children of dragginggBE
    const relation = this.rootStore.BEStore.getRelationOf(
      data.target,
      this.getState.draggingBEs[0]
    );

    if (relation === BE_RELATIONS.CHILDREN || relation === BE_RELATIONS.SELF) {
      return this.setState({ draggedOverBEState: null });
    }

    this.setState({ draggedOverBEState: data });
  }

  toggleIsOutlineVisible() {
    this.setState({ isOutlineVisible: !this.getState.isOutlineVisible });
  }

  createBE(data: Partial<Omit<DO_BE, 'id'>>) {
    const newBE = this.formIntoBE(data);
    const validatedBE = this.validateBE(newBE);
    const BE = this.rootStore.BEStore.setBE(validatedBE);
    const parentBE = this.rootStore.BEStore.getBEById(
      BE.parentId
    ) as IDORecursiveBE<IRecursiveBEContents>;
    const clonedParentBE = this.rootStore.di.utils._.cloneDeep(parentBE);
    clonedParentBE.contents.childrenIds.push(BE.id);
    this.rootStore.BEStore.setBE(clonedParentBE);
    return BE;
  }

  updateBE(targetBE: DO_BE, data: Partial<Omit<DO_BE, 'id'>>) {
    const newBEdata = {
      ...this.rootStore.di.utils._.cloneDeep(targetBE),
      ...data,
    };
    const newBE = this.formIntoBE(newBEdata);
    const validatedBE = this.validateBE(newBE);
    return this.rootStore.BEStore.setBE(validatedBE);
  }

  removeBE(BE: DO_BE) {
    if (this.rootStore.BEStore.getRootBE.id === BE.id)
      throw new Error('Root BE cannot be removed');

    // Remove this BE from its parent BE
    const parentBE = this.rootStore.BEStore.getBEById(
      BE.parentId
    ) as IDORecursiveBE<IRecursiveBEContents>;

    const clonedParentBE = this.rootStore.di.utils._.cloneDeep(parentBE);

    clonedParentBE.contents.childrenIds =
      clonedParentBE.contents.childrenIds.filter((id) => BE.id !== id);

    this.rootStore.BEStore.setBE(clonedParentBE);

    // Remove its children
    if (this.rootStore.BEStore.BETypeGuards.isRecursive(BE)) {
      BE.contents.childrenIds.forEach((id) => {
        this.rootStore.BEStore.removeBE(id);
      });
    }

    // Remove this BE
    this.rootStore.BEStore.removeBE(BE.id);
  }

  reoderBE() {
    const draggingBEs = this.getState.draggingBEs;
    const draggedOverBEState = this.getState.draggedOverBEState;

    if (draggingBEs.length === 0 || !draggedOverBEState) return;

    // if the draggedOverBE to reoder onto is itself or children of draggingBE, prevent reorder
    const index = draggingBEs.findIndex((BE) => {
      const relation = this.rootStore.BEStore.getRelationOf(
        draggedOverBEState.target,
        BE
      );

      if (relation === BE_RELATIONS.CHILDREN || relation === BE_RELATIONS.SELF)
        return true;
    });

    if (index > -1)
      throw new Error('Cannot reoder BE onto itself or its children');

    const position = draggedOverBEState.position;
    const newParentBE =
      position === BE_DROP_POSITION.INSIDE
        ? draggedOverBEState.target
        : this.rootStore.BEStore.getParentBE(draggedOverBEState.target);
    const isNewParentRecursive =
      this.rootStore.BEStore.BETypeGuards.isRecursive(newParentBE);

    draggingBEs.forEach((BE) => {
      if (!isNewParentRecursive)
        throw new Error('New Parent BE must be a recursiveBE');

      const oldParentBE = this.rootStore.BEStore.getParentBE(BE);
      const childrenIdsForOldParentBE = oldParentBE.contents.childrenIds.filter(
        (id) => id !== BE.id
      );

      this.updateBE(BE, { parentId: newParentBE.id });
      this.updateBE(oldParentBE, {
        contents: {
          ...oldParentBE.contents,
          childrenIds: childrenIdsForOldParentBE,
        },
      });

      let childrenIdsForNewParentBE: string[] = [];

      if (
        position === BE_DROP_POSITION.PREV ||
        position === BE_DROP_POSITION.NEXT
      ) {
        childrenIdsForNewParentBE =
          oldParentBE.id === newParentBE.id
            ? childrenIdsForOldParentBE
            : newParentBE.contents.childrenIds.map((id) => id);

        const index = childrenIdsForNewParentBE.findIndex(
          (id) => id === draggedOverBEState.target.id
        );

        childrenIdsForNewParentBE.splice(
          position === BE_DROP_POSITION.PREV ? index : index + 1,
          0,
          BE.id
        );
      }

      if (position === BE_DROP_POSITION.INSIDE) {
        childrenIdsForNewParentBE =
          oldParentBE.id === newParentBE.id
            ? [...childrenIdsForOldParentBE, BE.id]
            : [...newParentBE.contents.childrenIds, BE.id];
      }

      this.updateBE(newParentBE, {
        contents: {
          ...newParentBE.contents,
          childrenIds: childrenIdsForNewParentBE,
        },
      });
    });

    this.setDraggedOverBE(null);
    this.setDraggingBE(null);
  }

  validateBE(BE: DO_BE) {
    // Make sure BE have non-optional properties and corressponding contents.
    const baseBEProps: IDOBaseBE = {
      id: '',
      parentId: '',
      tag: this.rootStore.enums.BE_TAGS.TEXT,
      contents: {},
    };

    Object.entries(baseBEProps).forEach(([prop, value]) => {
      if (
        !Object.hasOwn(BE, prop) ||
        typeof value !== typeof BE[prop as keyof DO_BE]
      )
        throw new Error(
          `validateBEdata() failed, propperty: ${prop} in BE: ${BE} is incorrect`
        );
    });

    const contentsProps = this.getContentsPropertiesByTag(BE.tag);

    // BE.contents must have props of "contentsProps",
    Object.entries(contentsProps).forEach(([prop, value]) => {
      if (
        !Object.hasOwn(BE.contents, prop) ||
        typeof value !== typeof BE.contents[prop as keyof BE_CONTENTS]
      ) {
        throw new Error(
          `validateBEdata() failed, contents propperty: ${prop} in BE: ${JSON.stringify(
            BE
          )} is incorrect`
        );
      }
    });

    if (Object.keys(contentsProps).length !== Object.keys(BE.contents).length) {
      throw new Error(
        `validateBEdata() failed, contents propperties in BE: ${JSON.stringify(
          BE
        )} is incorrect`
      );
    }

    return BE;
  }

  private getContentsPropertiesByTag(tag: BE_TAGS): BE_CONTENTS {
    switch (tag) {
      case this.rootStore.enums.BE_TAGS.ROOT:
        return { childrenIds: [] };
      case this.rootStore.enums.BE_TAGS.HEADING:
        return { innerText: '' };
      case this.rootStore.enums.BE_TAGS.TEXT:
        return { innerText: '' };
      case this.rootStore.enums.BE_TAGS.CONTAINER_ROW:
        return { childrenIds: [] };
      case this.rootStore.enums.BE_TAGS.CONTAINER_COLUMN:
        return { childrenIds: [] };
      case this.rootStore.enums.BE_TAGS.TOGGLE_HEADING_LIST:
      case this.rootStore.enums.BE_TAGS.TOGGLE_LIST:
      case this.rootStore.enums.BE_TAGS.BULLETED_LIST:
      case this.rootStore.enums.BE_TAGS.NUMBERED_LIST:
        return { innerText: '', childrenIds: [] };

      default:
        throw new Error('Unregistered BE tag');
    }
  }

  // Trasform BE data into DO_BE instance in a corresponding form by its tag
  private formIntoBE(BE: Partial<IDOBaseBE>): DO_BE {
    BE = this.rootStore.di.utils._.cloneDeep(BE);

    // Set all the possible properties with the default value then overide with BE provided
    const newBE = {
      id: this.rootStore.di.utils.createUniqueId(
        this.rootStore.options.SHORT_UNIQUE_ID_LENGTH
      ),
      tag: this.rootStore.enums.BE_TAGS.TEXT,
      parentId: this.rootStore.BEStore.getRootBE.id,
      ...BE,
      contents: {
        innerText: '',
        childrenIds: [],
        ...BE.contents,
      },
    };

    const contentsProps = this.getContentsPropertiesByTag(newBE.tag);

    // Properties that exist in "newBE.contents" but not in "contentsProps", gets deleted
    Object.keys(newBE.contents).forEach((prop) => {
      if (!Object.hasOwn(contentsProps, prop)) {
        delete newBE.contents[prop as keyof BE_CONTENTS];
      }
    });

    return this.rootStore.BEStore.instantiateDO(newBE);
  }
}
