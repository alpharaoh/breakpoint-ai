"use client";

import {
  AssistantRuntimeProvider,
  ThreadMessageLike,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { FC } from "react";

interface AssistantProps {
  initialMessages?: ThreadMessageLike[];
}

export const Assistant: FC<AssistantProps> = ({ initialMessages }) => {
  const runtime = useChatRuntime({
    api: "/api/chat",
    initialMessages: initialMessages,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};
