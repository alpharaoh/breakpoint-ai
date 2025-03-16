import { db } from "@/lib/db";
import { Message } from "ai";
import { v4 as uuidv4 } from "uuid";

export const createThread = async (name: string, messages: Message[]) => {
  const id = await db.threads.add({ id: uuidv4(), name, messages });

  return id;
};

export const upsertThread = async (
  id: string,
  name: string,
  messages: Message[],
) => {
  await db.threads.put({ id, name, messages });
};

export const getThread = async (id: string) => {
  return await db.threads.get(id);
};

export const getThreads = async () => {
  return await db.threads.toArray();
};
