// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IStoreInstance {}

export interface IStoreStatic {
  new (): IStoreInstance;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

/* class decorator */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
