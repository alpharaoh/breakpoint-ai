"use client";
import { Assistant } from "@/app/assistant";

import { ThreadMessageLike } from "@assistant-ui/react";
import { usePathname } from "next/navigation";
import { getThreadId } from "@/lib/get-thread-id";
import { getThread } from "@/lib/chat-service";
import { type Thread } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Thread() {
  const pathname = usePathname();
  const [currentThread, setCurrentThread] = useState<Thread>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getThreadFunc = async () => {
      const threadId = getThreadId(pathname);
      try {
        const thread = await getThread(threadId);
        setCurrentThread(thread);
      } finally {
        setLoading(false);
      }
    };
    getThreadFunc();
  }, [pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentThread) {
    return <div>Thread not found</div>;
  }

  const initialMessages: ThreadMessageLike[] =
    currentThread?.messages?.map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: JSON.parse(message.content),
    })) ?? [];

  return (
    <div className="bg-primary-foreground">
      <Assistant initialMessages={initialMessages} />
    </div>
  );
}
