import { type Message } from "ai";
import Dexie, { type EntityTable } from "dexie";

interface Thread {
  id: string;
  name: string;
  messages: Message[];
}

const db = new Dexie("breakpoints-db") as Dexie & {
  threads: EntityTable<Thread, "id">;
};

// Schema declaration:
db.version(1).stores({ threads: "$$id" });

export type { Thread };
export { db };
