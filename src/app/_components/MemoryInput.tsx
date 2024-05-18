"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function MemoryInput() {
  const [name, setName] = useState("");
  const utils = api.useUtils();
  const addMemory = api.worldcoin.addMemory.useMutation({
    onSuccess: async () => {
      await utils.worldcoin.getMemories.invalidate();
    },
  });

  const onSubmit = async () => {
    addMemory.mutate(name);
  };

  if (addMemory.isSuccess) {
    return <div className="font-medium">Thanks for adding your memory ;)</div>;
  }

  return (
    <div className="flex gap-2">
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Write your name"
        className="rounded-md border-2 border-black px-4 py-2 outline-none"
      />
      <button
        onClick={onSubmit}
        disabled={addMemory.isPending}
        className="rounded-md border-2 border-black px-4 py-2 transition-colors duration-300 hover:bg-black hover:text-white"
      >
        {!addMemory.isPending ? "Sent memory" : "Adding..."}
      </button>
    </div>
  );
}
