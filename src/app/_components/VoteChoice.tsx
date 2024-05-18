import clsx from "clsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { Loader } from "./Loader";

interface VoteChoiceProps {
  isVerified: boolean;
  nullifierHash: string | null;
}

export function VoteChoice(props: VoteChoiceProps) {
  const utils = api.useUtils();
  const votesQuery = api.worldcoin.getVotes.useQuery();
  const addVoteMutation = api.worldcoin.addVote.useMutation({
    onSuccess: async () => {
      await utils.worldcoin.getVotes.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleChoice = async (vote: "UP" | "DOWN") => {
    if (!props.isVerified || !props.nullifierHash) {
      toast.error("You need to verify with World ID to make a vote");
      return;
    }

    await addVoteMutation.mutateAsync({
      nullifier_hash: props.nullifierHash,
      vote,
    });
  };

  if (votesQuery.isLoading) {
    return <Loader />;
  }

  if (!votesQuery.data) {
    return <div className="mt-40 text-3xl font-extrabold">No votes</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-semibold">$WLD price will go:</h1>
      <div className="flex gap-8">
        <Choice
          all={votesQuery.data.allVotesCount}
          lower={votesQuery.data.upVotesCount}
          option="UP"
          handleChoice={handleChoice}
        />
        <Choice
          all={votesQuery.data.allVotesCount}
          lower={votesQuery.data.downVotesCount}
          option="DOWN"
          handleChoice={handleChoice}
        />
      </div>
      <div className="font-semibold">
        Total votes: {votesQuery.data.allVotesCount + 10}
      </div>
    </div>
  );
}

interface ChoiceProps {
  option: "UP" | "DOWN";
  lower: number;
  all: number;
  handleChoice: (vote: "UP" | "DOWN") => Promise<void>;
}

function Choice(props: ChoiceProps) {
  return (
    <div className="flex select-none flex-col items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => props.handleChoice(props.option)}
        className={clsx(
          "relative flex size-40 cursor-pointer items-center justify-center rounded-lg border-2",
          props.option === "UP"
            ? " border-green-600 bg-green-400"
            : " border-red-600 bg-red-400",
        )}
      >
        <span className="absolute text-5xl font-bold tracking-tight opacity-40">
          {((props.lower / props.all) * 100).toFixed(0)}%
        </span>
      </motion.div>
      <span className="text-3xl font-extrabold">{props.option}</span>
    </div>
  );
}
