import cookie from 'js-cookie';
import { IStoreStatic, staticImplements } from './IStoreStatic';

@staticImplements<IStoreStatic>()
export class Store {
  static async get(key: string): Promise<string | null> {
    return cookie.get(key) ?? null;
  }
  static async set(key: string, value: string): Promise<void> {
    cookie.set(key, value);
  }
}

export default Store;
