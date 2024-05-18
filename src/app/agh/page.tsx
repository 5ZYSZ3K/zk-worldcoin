"use client";

import toast from "react-hot-toast";
import { AGHVoteChoice } from "../_components/agh/AGHVoteChoice";

export default function Vote() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-black">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <div className="text-4xl font-extrabold tracking-tight">
          AGH Blockchain Election
        </div>
        <button
          className="rounded-md border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          onClick={() => toast.error("This vote has ended.")}
        >
          Verify with World ID to vote
        </button>
        <AGHVoteChoice />
      </div>
    </main>
  );
}
