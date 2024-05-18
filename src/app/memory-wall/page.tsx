"use client";

import {
  IDKitWidget,
  VerificationLevel,
  type ISuccessResult,
} from "@worldcoin/idkit";
import { useState } from "react";

import { env } from "~/env";
import { api } from "~/trpc/react";
import { MemoryInput } from "../_components/MemoryInput";
import { Memories } from "../_components/Memories";

const APP_ID = env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`;
const ACTION_NAME = "memory-wall";

export default function MemoryWall() {
  const [isVerified, setIsVerified] = useState(false);
  const verifyMutation = api.worldcoin.verify.useMutation({});

  const handleVerify = async (result: ISuccessResult) => {
    await verifyMutation.mutateAsync({
      ...result,
      action: ACTION_NAME,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pb-8 text-black">
      <div className="container sticky top-0 flex flex-col items-center justify-start gap-12 bg-white px-4 py-16 ">
        <div className="text-4xl font-extrabold tracking-tight">
          Tudemun Memory Wall
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
                Verify with World ID
              </button>
            )}
          </IDKitWidget>
        ) : (
          <MemoryInput />
        )}
      </div>
      <Memories />
    </main>
  );
}
