import Dexie, { Transaction, type EntityTable } from "dexie";

interface Thread {
  id: number;
  name: string;
  messages: string; // json blob
}

const db = new Dexie("breakpoints-db") as Dexie & {
  threads: EntityTable<Thread, "id">;
};

// Schema declaration:
db.version(1).stores({
  threads: "++id, name, messages", // primary key "id" (for the runtime!)
});

// db.on("populate", (tx: Transaction) => {
//   tx.table("threads").add({ id: 1, name: "New Thread", messages: "[]" });
// });

export type { Thread };
export { db };
