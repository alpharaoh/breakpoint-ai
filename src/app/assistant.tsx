"use client";

import {
  AssistantRuntimeProvider,
  ThreadMessageLike,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { getThread } from "@/lib/chat-service";
import { useEffect, useState } from "react";
import { useCustomRuntime } from "@/lib/use-custom-runtime";

export const Assistant = () => {
  const [initialMessages, setInitialMessages] = useState<ThreadMessageLike[]>(
    [],
  );

  useEffect(() => {
    getThread(1).then((thread) => {
      if (!thread) return;
      setInitialMessages(JSON.parse(thread.messages));
    });
  }, []);

  const customRuntime = useCustomRuntime({});

  const runtime = useChatRuntime({
    api: "/api/chat",
    initialMessages,
    onFinish: (messages) => {
      console.log(messages);
    },
  });

  return (
    <AssistantRuntimeProvider runtime={customRuntime}>
      <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};
