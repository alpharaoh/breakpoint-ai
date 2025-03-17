"use client";

import {
  AssistantRuntimeProvider,
  ThreadMessageLike,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { FC } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface AssistantProps {
  initialMessages?: ThreadMessageLike[];
}

export const Assistant: FC<AssistantProps> = ({ initialMessages }) => {
  const runtime = useChatRuntime({
    api: "/api/chat",
    initialMessages: initialMessages,
  });

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ResizablePanelGroup
        direction="horizontal"
        className="grid h-dvh grid-cols-[200px_1fr] px-4 py-4 gap-2 h-full"
        onLayout={onLayout}
      >
        <ResizablePanel className="h-full hidden lg:block" defaultSize={10}>
          <ThreadList />
        </ResizablePanel>
        <ResizableHandle className="opacity-0" />
        <ResizablePanel className="h-full rounded-md" defaultSize={90}>
          <Thread />
        </ResizablePanel>
      </ResizablePanelGroup>
    </AssistantRuntimeProvider>
  );
};
