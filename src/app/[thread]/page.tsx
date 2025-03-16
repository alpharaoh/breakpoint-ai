"use client";
import { Assistant } from "@/app/assistant";

import { ThreadMessageLike } from "@assistant-ui/react";
import { usePathname } from "next/navigation";
import { getThreadId } from "@/lib/get-thread-id";
import { getThread, upsertThread } from "@/lib/chat-service";
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

  useEffect(() => {
    const generateTitle = async () => {
      if (currentThread && currentThread.name === "New Chat") {
        const newThreadName = await fetch("/api/chat/generate_title", {
          method: "POST",
          body: JSON.stringify({ messages: currentThread.messages }),
        }).then((res) => res.text());

        upsertThread(currentThread.id, newThreadName, currentThread.messages);
      }
    };
    generateTitle();
  }, [currentThread]);

  if (loading) {
    return (
      <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        Loading...
      </div>
    );
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
