"use client";
import { Assistant } from "@/app/assistant";

import { ThreadMessageLike } from "@assistant-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { usePathname } from "next/navigation";
import { getThreadId } from "@/lib/get-thread-id";
import { getThread } from "@/lib/chat-service";

export default function Thread() {
  const pathname = usePathname();

  const currentThread = useLiveQuery(() => {
    const threadId = getThreadId(pathname);

    return getThread(threadId);
  });

  const initialMessages: ThreadMessageLike[] =
    currentThread?.messages?.map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: message.content,
    })) ?? [];

  if (!currentThread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-primary-foreground">
      <Assistant initialMessages={initialMessages} />
    </div>
  );
}
