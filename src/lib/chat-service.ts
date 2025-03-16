import { db } from "@/lib/db";
import { Message } from "ai";

export const createThread = async (name: string, messages: Message[]) => {
  const id = await db.threads.add({ name, messages });

  return id;
};

export const upsertThread = async (
  id: number,
  name: string,
  messages: Message[],
) => {
  await db.threads.put({ id, name, messages });
};

export const getThread = async (id: number) => {
  return await db.threads.get(id);
};

export const getThreads = async () => {
  return await db.threads.toArray();
};
