import { produce } from 'immer';
import { Mutate, StoreApi, UseBoundStore, create } from 'zustand';

interface IDOTest {
  a: string;
  b: {
    c: string;
    d: string[];
  };
  e: string[];
  f: { g: string }[];
}

export class DOTest implements IDOTest {
  a: string;
  b: { c: string; d: string[] };
  e: string[];
  f: { g: string }[];

  constructor(data: IDOTest) {
    this.a = data.a;
    this.b = data.b;
    this.e = data.e;
    this.f = data.f;
  }

  useState = create<IDOTest>()(() => ({
    a: this.a,
    b: this.b,
    e: this.e,
    f: this.f,
  }));

  setState = (data: Partial<IDOTest>) => {
    this.useState.setState((state) => {
      return { ...state, ...data };
    });
  };

  getA = () => {
    return this.useState().a;
  };

  getA2 = () => {
    return this.useState.getState().a;
  };
}

export class DOTest2 {
  useState: UseBoundStore<StoreApi<IDOTest>>;

  constructor(data: IDOTest) {
    this.useState = create<IDOTest>()((set) => ({
      a: data.a,
      b: data.b,
      e: data.e,
      f: data.f,
    }));
  }

  setState = (data: Partial<IDOTest>) => {
    this.useState.setState(
      produce((state) => {
        const newState = { ...state, ...data };
        console.log(6363, newState);
        return newState;
      })
    );
  };

  get = () => {
    return this.useState();
  };

  get getA() {
    return this.useState().a;
  }

  getA2 = () => {
    return this.useState.getState().a;
  };

  getA3() {
    return this.useState().a;
  }
}

const doData = {
  a: 'aaa',
  b: {
    c: 'ccc',
    d: ['d1', 'd2', 'd3'],
  },
  e: ['e1', 'e2', 'e3'],
  f: [{ g: 'ggg1' }, { g: 'ggg2' }, { g: 'ggg3' }],
};

export const DOTest2Instance = new DOTest2(doData);

type DOTest3Type = {
  id: string;
  array: string[];
  object: {};
};

interface IDOTest3 {
  [id: string]: DOTest3Type;
}

class DOTest3 {
  useState: UseBoundStore<StoreApi<IDOTest3>>;

  constructor(data: DOTest3Type) {
    this.useState = create<IDOTest3>()((set) => ({
      [data.id]: {
        id: data.id,
        array: data.array,
        object: data.object,
      },
    }));
  }

  setState = (data: DOTest3Type) => {
    this.useState.setState(
      produce((state) => {
        const newState = { ...state, [data.id]: data };
        return newState;
      })
    );
  };

  getById(id: string) {
    return this.useState.getState()[id];
  }
  getById2(id: string) {
    return this.useState()[id];
  }
}

export const DOTest3Data: DOTest3Type = {
  id: '1',
  array: ['1', '2', '3'],
  object: {
    a: '1',
  },
};

export const DOTest3Instance = new DOTest3(DOTest3Data);
