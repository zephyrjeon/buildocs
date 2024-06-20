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
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  NEXT = 'NEXT',
}

type DraggedOverBEState = {
  target: DO_BE;
  position: BE_DROP_POSITION;
};

interface IState {
  focusedBE: DO_BE | null; // BE that is being edited
  hoveredBE: DO_BE | null; // BE that is being edited
  draggingBEs: DO_BE[];
  draggedOverBEState: DraggedOverBEState | null;
}

export class BEEditorStore {
  rootStore: RootStore;

  private state = create<IState>()(() => ({
    focusedBE: null,
    hoveredBE: null,
    draggingBEs: [],
    draggedOverBEState: null,
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

  get useHoveredBE() {
    return this.useState.hoveredBE;
  }

  get useDraggedOverBE() {
    return this.useState.draggedOverBEState;
  }

  get useDraggingBEs() {
    return this.useState.draggingBEs;
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

    // Do not allow to set when draggedOverBE is leafBE and dropPosition is either TOP or BOTTOM of the inside
    const isRecursive = this.rootStore.BEStore.BETypeGuards.isRecursive(
      data.target
    );

    if (!isRecursive && data.position !== BE_DROP_POSITION.NEXT) {
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

    // if the targetBE to reoder onto is itself or children of draggingBE, prevent reorder
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
    const targetBE =
      position === BE_DROP_POSITION.NEXT
        ? this.rootStore.BEStore.getParentBE(draggedOverBEState.target)
        : draggedOverBEState.target;
    const isTargetRecursive =
      this.rootStore.BEStore.BETypeGuards.isRecursive(targetBE);

    draggingBEs.forEach((BE) => {
      if (!isTargetRecursive) throw new Error('TargetBE must be a recursiveBE');

      this.updateBE(BE, { parentId: targetBE.id });

      const parentBE = this.rootStore.BEStore.getParentBE(BE);
      const childrenIdsForParentBE = parentBE.contents.childrenIds.filter(
        (id) => id !== BE.id
      );

      this.updateBE(parentBE, {
        contents: { ...parentBE.contents, childrenIds: childrenIdsForParentBE },
      });

      let childrenIdsForTargetBE: string[] = [];

      // when position is TOP, draggingBE is placed as the first children of targetBE
      if (position === BE_DROP_POSITION.TOP) {
        childrenIdsForTargetBE =
          parentBE.id === targetBE.id
            ? [BE.id, ...childrenIdsForParentBE]
            : [BE.id, ...targetBE.contents.childrenIds];
      }

      // when position is BOTTM, draggingBE is placed as the last children of targetBE
      if (position === BE_DROP_POSITION.BOTTOM) {
        childrenIdsForTargetBE =
          parentBE.id === targetBE.id
            ? [...childrenIdsForParentBE, BE.id]
            : [...targetBE.contents.childrenIds, BE.id];
      }

      // when position is NEXT, draggingBE is placed as the next sibling of targetBE
      if (position === BE_DROP_POSITION.NEXT) {
        childrenIdsForTargetBE =
          parentBE.id === targetBE.id
            ? childrenIdsForParentBE
            : targetBE.contents.childrenIds.map((id) => id);

        const index = childrenIdsForTargetBE.findIndex(
          (id) => id === draggedOverBEState.target.id
        );

        childrenIdsForTargetBE.splice(index + 1, 0, BE.id);
      }

      this.updateBE(targetBE, {
        contents: {
          ...targetBE.contents,
          childrenIds: childrenIdsForTargetBE,
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
      tag: this.rootStore.di.enums.BE_TAGS.TEXT,
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
      case this.rootStore.di.enums.BE_TAGS.ROOT:
        return { childrenIds: [] };
      case this.rootStore.di.enums.BE_TAGS.HEADING:
        return { innerText: '' };
      case this.rootStore.di.enums.BE_TAGS.TEXT:
        return { innerText: '' };
      case this.rootStore.di.enums.BE_TAGS.CONTAINER_ROW:
        return { childrenIds: [] };
      case this.rootStore.di.enums.BE_TAGS.CONTAINER_COLUMN:
        return { childrenIds: [] };
      case this.rootStore.di.enums.BE_TAGS.TOGGLE_HEADING_LIST:
      case this.rootStore.di.enums.BE_TAGS.TOGGLE_LIST:
      case this.rootStore.di.enums.BE_TAGS.BULLETED_LIST:
      case this.rootStore.di.enums.BE_TAGS.NUMBERED_LIST:
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
      tag: this.rootStore.di.enums.BE_TAGS.TEXT,
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
