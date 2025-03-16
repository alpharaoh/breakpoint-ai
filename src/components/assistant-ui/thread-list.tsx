import type { ChangeEvent, FC, MouseEventHandler } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import Image from "next/image";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { deleteThread, getThreads } from "@/lib/chat-service";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-1.5">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/breakpoint.svg"
          alt="Breakpoint"
          width={110}
          height={100}
          className="mb-2"
        />
      </Link>
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <Link href="/">
      <Button
        className="cursor-pointer w-full data-[active]:bg-muted hover:bg-muted flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start"
        variant="ghost"
      >
        <PlusIcon />
        New Thread
      </Button>
    </Link>
  );
};

const ThreadListItems: FC = () => {
  const currentThread = useLiveQuery(getThreads);

  return (
    <div className="space-y-1.5">
      {currentThread?.map((thread) => (
        <ThreadListItem key={thread.id} id={thread.id} name={thread.name} />
      ))}
    </div>
  );
};

const ThreadListItem: FC<{ id: string; name: string }> = ({ id, name }) => {
  return (
    <Link
      href={`/${id}`}
      className="w-full cursor-pointer data-[active]:bg-muted hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2"
    >
      <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2 text-start text-sm">
        {name ?? "New Chat"}
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive id={id} />
    </Link>
  );
};

const ThreadListItemArchive: FC<{ id: string }> = ({ id }) => {
  const handleDelete: MouseEventHandler = (e) => {
    e.preventDefault();

    deleteThread(id);
  };

  return (
    <TooltipIconButton
      onClick={handleDelete}
      className="hover:text-primary text-foreground ml-auto mr-3 size-4 p-0"
      variant="ghost"
      tooltip="Archive thread"
    >
      <ArchiveIcon />
    </TooltipIconButton>
  );
};
