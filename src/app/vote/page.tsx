"use client";

import {
  IDKitWidget,
  VerificationLevel,
  type ISuccessResult,
} from "@worldcoin/idkit";
import { useState } from "react";

import { api } from "~/trpc/react";
import { VoteChoice } from "../_components/VoteChoice";
import { env } from "~/env";

const APP_ID = env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`;
const ACTION_NAME = "vote";

export default function Vote() {
  const [isVerified, setIsVerified] = useState(false);
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);

  const verifyMutation = api.worldcoin.verify.useMutation();

  const handleVerify = async (result: ISuccessResult) => {
    const response = await verifyMutation.mutateAsync({
      ...result,
      action: ACTION_NAME,
    });

    if (!response.ok) {
      throw new Error(response.detail);
    }
    setNullifierHash(response.nullifier_hash);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-black">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <div className="text-4xl font-extrabold tracking-tight">
          Tudemun Vote
        </div>
        {!isVerified ? (
          <IDKitWidget
            app_id={APP_ID}
            action={ACTION_NAME}
            onSuccess={() => {
              setIsVerified(true);
            }}
            handleVerify={handleVerify}
            verification_level={VerificationLevel.Device}
          >
            {({ open }) => (
              <button
                className="rounded-md border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
                onClick={open}
              >
                Verify with World ID to vote
              </button>
            )}
          </IDKitWidget>
        ) : null}
        <VoteChoice isVerified={isVerified} nullifierHash={nullifierHash} />
      </div>
    </main>
  );
}
