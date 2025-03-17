import { db } from "@/lib/db";
import { Message } from "ai";
import { v4 as uuidv4 } from "uuid";

export const createThread = async (name: string, messages: Message[]) => {
  const id = await db.threads.add({
    id: uuidv4(),
    name,
    messages,
    createdAt: new Date(),
  });

  return id;
};

export const upsertThread = async (
  id: string,
  name: string,
  messages: Message[],
) => {
  const thread = await db.threads.get(id);
  if (thread) {
    await db.threads.update(id, { name, messages });
    return;
  }
  await db.threads.put({ id, name, messages, createdAt: new Date() });
};

export const deleteThread = async (id: string) => {
  await db.threads.delete(id);
};

export const getThread = async (id: string) => {
  return await db.threads.get(id);
};

export const getThreads = async () => {
  return await db.threads.toArray();
};
