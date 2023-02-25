import * as SecureStore from 'expo-secure-store';
import { IStoreStatic, staticImplements } from './IStoreStatic';

@staticImplements<IStoreStatic>()
export class Store {
  static async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }
  static async set(key: string, value: string): Promise<void> {
    return await SecureStore.setItemAsync(key, value);
  }
}

export default Store;
