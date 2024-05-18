import clsx from "clsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function AGHVoteChoice() {
  const handleChoice = () => {
    toast.error("You need to verify with World ID to make a vote");
    return;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-semibold">
        Who should be a chairman of AGH Blockchain:
      </h1>
      <div className="flex gap-8">
        <Choice
          all={22}
          lower={16}
          option="Karol Kowalczyk"
          handleChoice={handleChoice}
        />
        <Choice
          all={22}
          lower={6}
          option="Krzysztof Trzcianowski"
          handleChoice={handleChoice}
        />
      </div>
      <div className="font-semibold">Total votes: 26</div>
    </div>
  );
}

interface ChoiceProps {
  option: string;
  lower: number;
  all: number;
  handleChoice: (vote: string) => void;
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
          " border-purple-600 bg-purple-400",
        )}
      >
        <span className="absolute text-5xl font-bold tracking-tight opacity-40">
          {((props.lower / props.all) * 100).toFixed(0)}%
        </span>
      </motion.div>
      <span className="text-lg font-semibold">{props.lower} votes</span>
      <span className="max-w-60 text-center text-3xl font-extrabold">
        {props.option}
      </span>
    </div>
  );
}
