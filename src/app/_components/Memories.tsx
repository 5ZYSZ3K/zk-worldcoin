"use client";

import moment from "moment";
import { api } from "~/trpc/react";
import { Loader } from "./Loader";

export function Memories() {
  const { data, isLoading } = api.worldcoin.getMemories.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.length) {
    return <div className="mt-40 text-3xl font-extrabold">No memories</div>;
  }

  return (
    <div>
      {data.map((memory) => (
        <div key={memory.id} className="grid grid-cols-2 gap-12">
          <span className="text-xl font-semibold">{memory.name}</span>
          <span>
            {moment(memory.createdAt, "YYYYMMDD").format("DD.MM.YYYY hh:mm a")}
          </span>
        </div>
      ))}
    </div>
  );
}
