import { useState } from "react";
import {
  useExternalStoreRuntime,
  AppendMessage,
  ThreadMessageLike,
} from "@assistant-ui/react";
import {
  createThread,
  getThread,
  getThreads,
  upsertThread,
} from "@/lib/chat-service";
import { useLiveQuery } from "dexie-react-hooks";
import { Thread } from "@/lib/db";

const backendApi = async (input: string) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from backend");
    }

    const data = await response.json();
    return {
      role: "assistant",
      content: data.message, // Assuming the API response structure contains { message: "response text" }
    };
  } catch (error) {
    console.error("Error in backendApi:", error);
    return {
      role: "assistant",
      content: "Sorry, I encountered an error while processing your request.",
    };
  }
};

export const useCustomRuntime = ({}) => {
  const [isRunning, setIsRunning] = useState(false);

  const threads = useLiveQuery(async () => {
    return await getThreads();
  });

  const currentThread = threads?.[0];
  const messages =
    currentThread?.messages === undefined
      ? [{ role: "assistant", content: "Hello! How can I help you today?" }]
      : JSON.parse(currentThread.messages);

  const onNew = async (message: AppendMessage) => {
    let thread: Thread | undefined = currentThread;

    if (!thread) {
      const id = await createThread("Thread 1", JSON.stringify([message]));
      thread = (await getThread(id)) as Thread;
    }

    if (message.content[0]?.type !== "text") {
      throw new Error("Only text messages are supported");
    }

    const input = message.content[0].text;
    const newMessages = [...messages, { role: "user", content: input }];

    await upsertThread(thread.id, thread.name, JSON.stringify(newMessages));

    setIsRunning(true);
    const assistantMessage = await backendApi(input);

    const newMessagesAfterGeneration = [...newMessages, assistantMessage];
    await upsertThread(
      thread.id,
      thread.name,
      JSON.stringify(newMessagesAfterGeneration),
    );
    setIsRunning(false);
  };

  console.log(isRunning, messages);

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage: (message: ThreadMessageLike) => message,
    onNew,
  });

  return runtime;
};
