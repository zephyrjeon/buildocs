import { APP_ENUMS } from '@/common/enums';
import {
  BE_CONTENTS,
  BE_TAGS,
  DO_BE,
  IDOBaseBE,
  IDORecursiveBE,
  IRecursiveBEContents,
} from '@/entities/blockElement/BEInterfaces';
import { produce } from 'immer';
import _ from 'lodash';
import ShortUniqueId from 'short-unique-id';
import { create } from 'zustand';
import { RootStore } from './RootStore';

type DraggedOverBEState = {
  target: DO_BE;
  dropPosition: 'TOP' | 'BOTTOM' | 'NEXT';
};

interface IState {
  focusedBE: DO_BE | null; // BE that is being edited
  hoveredBE: DO_BE | null; // BE that is being edited
  draggingBEs: DO_BE[];
  draggedOverBEState: DraggedOverBEState | null;
}

export class BEEditorStore {
  private rootStore: RootStore;
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

    if (!isRecursive && data.dropPosition !== 'NEXT') {
      return this.setState({ draggedOverBEState: null });
    }

    // DO not allow to set when draggedOverBE is itself or children of dragginggBE
    const relation = this.rootStore.BEStore.getRelationOf(
      data.target,
      this.getState.draggingBEs[0]
    );

    if (relation === 'CHILDREN' || relation === 'SELF') {
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
    const clonedParentBE = _.cloneDeep(parentBE);
    clonedParentBE.contents.childrenIds.push(BE.id);
    this.rootStore.BEStore.setBE(clonedParentBE);
  }

  updateBE(targetBE: DO_BE, data: Partial<Omit<DO_BE, 'id'>>) {
    const newBEdata = { ..._.cloneDeep(targetBE), ...data };
    const newBE = this.formIntoBE(newBEdata);
    const validatedBE = this.validateBE(newBE);
    this.rootStore.BEStore.setBE(validatedBE);
  }

  removeBE(BE: DO_BE) {
    if (this.rootStore.BEStore.getRootBE.id === BE.id)
      throw new Error('Root BE cannot be removed');

    // Remove this BE from its parent BE
    const parentBE = this.rootStore.BEStore.getBEById(
      BE.parentId
    ) as IDORecursiveBE<IRecursiveBEContents>;

    const clonedParentBE = _.cloneDeep(parentBE);

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

      if (relation === 'CHILDREN' || relation === 'SELF') return true;
    });

    if (index > -1)
      throw new Error('Cannot reoder BE onto itself or its children');

    const target = draggedOverBEState.target;
    const dropPosition = draggedOverBEState.dropPosition;
    const isTargetRecursive =
      this.rootStore.BEStore.BETypeGuards.isRecursive(target);

    draggingBEs.forEach((BE) => {
      const parentOfBE = this.rootStore.BEStore.getParentBE(BE);

      // when dropPosition is TOP draggingBE is placed as the first children of targetBE
      if (dropPosition === 'TOP' && isTargetRecursive) {
        this.updateBE(BE, { parentId: target.id });
        this.updateBE(parentOfBE, {
          contents: {
            childrenIds: parentOfBE.contents.childrenIds.filter(
              (id) => id !== BE.id
            ),
          },
        });
        this.updateBE(target, {
          contents: { childrenIds: [BE.id, ...target.contents.childrenIds] },
        });
      }
      // when dropPosition is BOTTM draggingBE is placed as the last children of targetBE
      if (dropPosition === 'BOTTOM' && isTargetRecursive) {
        this.updateBE(BE, { parentId: target.id });
        this.updateBE(parentOfBE, {
          contents: {
            childrenIds: parentOfBE.contents.childrenIds.filter(
              (id) => id !== BE.id
            ),
          },
        });
        this.updateBE(target, {
          contents: { childrenIds: [...target.contents.childrenIds, BE.id] },
        });
      }

      // when dropPosition is NEXT draggingBE is placed as the next children of the parentBE of targetBE
      if (dropPosition === 'NEXT') {
        const parentOfTarget = this.rootStore.BEStore.getParentBE(target);
        this.updateBE(BE, { parentId: parentOfTarget.id });
        this.updateBE(parentOfBE, {
          contents: {
            childrenIds: parentOfBE.contents.childrenIds.filter(
              (id) => id !== BE.id
            ),
          },
        });

        const index = parentOfTarget.contents.childrenIds.findIndex(
          (id) => id === target.id
        );
        const newChildrenIds = parentOfTarget.contents.childrenIds.splice(
          index + 1,
          0,
          BE.id
        );
        this.updateBE(parentOfTarget, {
          contents: { childrenIds: newChildrenIds },
        });
      }
    });
  }

  validateBE(BE: DO_BE) {
    // Make sure BE have non-optional properties and corressponding contents.
    const baseBEProps: IDOBaseBE = {
      id: '',
      parentId: '',
      tag: APP_ENUMS.BE_TAGS.TEXT,
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
    return tag === APP_ENUMS.BE_TAGS.HEADING
      ? { innerText: '' }
      : tag === APP_ENUMS.BE_TAGS.TEXT
      ? { innerText: '' }
      : { childrenIds: [] };
  }

  // Trasform BE data into DO_BE instance in a corresponding form by its tag
  private formIntoBE(BE: Partial<IDOBaseBE>): DO_BE {
    BE = _.cloneDeep(BE);

    // Set all the possible properties with the default value then overide with BE provided
    const newBE = {
      id: new ShortUniqueId({ length: 10 }).rnd(),
      tag: APP_ENUMS.BE_TAGS.TEXT,
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

    return this.rootStore.BEStore.instantiateBE(newBE);
  }
}
