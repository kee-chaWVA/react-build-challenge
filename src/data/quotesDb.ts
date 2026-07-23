import { openDB } from "idb";
import type { Quote } from "../types/quote";
import { quotes as initialQuotes }  from "../data/quotes";

const DB_NAME = "quotes-db";
const STORE_NAME = "quotes";

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id'
      })
      initialQuotes.forEach((quote) => {
        store.add(quote);
      });
    }
  }
})

export async function getQuotes() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME)
}

export async function addQuote(quote: Quote) {
  const db = await dbPromise;
  await db.put(STORE_NAME, quote)
}