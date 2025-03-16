import { Assistant } from "@/app/assistant";

import { ThreadMessageLike } from "@assistant-ui/react";
import { getThreadId } from "@/lib/get-thread-id";
import { getThread } from "@/lib/chat-service";
import { type Thread } from "@/lib/db";
import { headers } from "next/headers";

export default async function Thread() {
  const headerList = await headers();

  const pathname = headerList.get("x-current-path");

  const threadId = getThreadId(pathname ?? "");
  const thread = await getThread(threadId);

  if (!thread) {
    return <div>Thread not found</div>;
  }

  const initialMessages: ThreadMessageLike[] = thread.messages.map(
    (message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: JSON.parse(message.content),
    }),
  );

  return (
    <div className="bg-primary-foreground">
      <Assistant initialMessages={initialMessages} />
    </div>
  );
}
