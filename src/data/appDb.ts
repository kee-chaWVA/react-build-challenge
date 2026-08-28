import { openDB } from "idb";
import { quotes as initialQuotes }  from "./quotes";

const DB_NAME = "react-dev-db";

export const STORES = {
  USERS: 'users',
  QUOTES: 'quotes'
} as const

type StoreName = typeof STORES[keyof typeof STORES]

export const dbPromise = openDB(DB_NAME, 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('quotes')) {
      const quoteStore = db.createObjectStore('quotes', {
        keyPath: 'id'
      })
      initialQuotes.forEach((quote) => {
        quoteStore.add(quote);
      });
    }

    if (!db.objectStoreNames.contains('users')) {
      db.createObjectStore('users', {
        keyPath: 'id'
      })
    }
  }
})

export async function getRecord<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const db = await dbPromise;
  return db.get(storeName, key)
}

export async function addRecord<T>(storeName: StoreName, record: T ): Promise<IDBValidKey> {
  const db = await dbPromise;
  return await db.add(storeName, record)
}

export async function updateRecord<T>(storeName: StoreName, record: T): Promise<IDBValidKey> {
  const db = await dbPromise;
  return await db.put(storeName, record)
}

export async function getAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await dbPromise;
  return db.getAll(storeName);
}

export async function deleteRecord(storeName: StoreName, key: IDBValidKey): Promise<void> {
  const db = await dbPromise;
  await db.delete(storeName, key)
}