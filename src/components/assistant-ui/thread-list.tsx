import { useState, type FC, type MouseEventHandler } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { getThreadId } from "@/lib/get-thread-id";
import { v4 as uuidv4 } from "uuid";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const models = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    logo: "/google.svg",
  },
];

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-between gap-2 px-3 py-5 text-left"
          disabled
        >
          <div className="flex items-center gap-3.5">
            <div className="p-1.5 bg-white rounded-full">
              <div className="flex h-6 w-6 items-center justify-center rounded-full overflow-hidden">
                <Image
                  src={selectedModel.logo || "/placeholder.svg"}
                  alt={selectedModel.name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{selectedModel.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedModel.id}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full overflow-hidden">
                <Image
                  src={model.logo || "/placeholder.svg"}
                  alt={model.name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{model.name}</span>
            </div>
            {selectedModel.id === model.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="flex flex-col justify-between h-full">
      <div className="flex flex-col items-stretch gap-1.5">
        <Link href={`/${uuidv4()}`} className="cursor-pointer">
          <Image
            src="/breakpoint.svg"
            alt="Breakpoint"
            width={110}
            height={22}
            className="mb-2"
          />
        </Link>
        <ThreadListNew />
        <ThreadListItems />
      </div>
      <div className="mb-1.5">
        <ModelSelector />
      </div>
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <Link href={`/${uuidv4()}`}>
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
      {currentThread
        ?.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((thread) => (
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
      <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2 text-start text-sm truncate">
        {name ?? "New Chat"}
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive id={id} />
    </Link>
  );
};

const ThreadListItemArchive: FC<{ id: string }> = ({ id }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete: MouseEventHandler = (e) => {
    e.preventDefault();

    deleteThread(id);

    const currentThreadId = getThreadId(pathname);
    if (currentThreadId === id) {
      router.replace(`/${uuidv4()}`);
    }
  };

  return (
    <TooltipIconButton
      onClick={handleDelete}
      className="hover:text-primary text-foreground ml-auto mr-3 size-4 p-0"
      variant="ghost"
      tooltip="Delete thread"
    >
      <ArchiveIcon />
    </TooltipIconButton>
  );
};
