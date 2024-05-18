import { TRPCError } from "@trpc/server";
import axios, { type AxiosError } from "axios";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { memories, votes } from "~/server/db/schema";

export const worldcoinRouter = createTRPCRouter({
  verify: publicProcedure
    .input(
      z.object({
        proof: z.string().min(1),
        merkle_root: z.string().min(1),
        nullifier_hash: z.string().min(1),
        verification_level: z.enum(["orb", "device"]),
        action: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await axios.post(
          `https://developer.worldcoin.org/api/v1/verify/${env.WORLDCOIN_APP_ID}`,
          {
            ...input,
          },
        );

        return {
          ok: true,
          code: "success",
          detail: "This action verified correctly!",
          nullifier_hash: input.nullifier_hash,
        } as const;
      } catch (e) {
        const axiosError = e as AxiosError<{
          code: string;
          detail: string;
        }>;
        return {
          ok: false,
          code: axiosError.response?.data.code,
          detail: axiosError.response?.data.detail,
        } as const;
      }
    }),
  addMemory: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(memories).values({ name: input }).execute();
    }),
  getMemories: publicProcedure.query(async ({ ctx }) => {
    const memoriesRows = await ctx.db.query.memories.findMany({
      columns: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: (memories, { desc }) => [desc(memories.createdAt)],
    });
    return memoriesRows;
  }),
  getVotes: publicProcedure.query(async ({ ctx }) => {
    const upVotes = await ctx.db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.vote, "UP"));

    const downVotes = await ctx.db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.vote, "DOWN"));

    const upVotesCount = upVotes[0]?.count ?? 0;
    const downVotesCount = downVotes[0]?.count ?? 0;

    return {
      upVotesCount,
      downVotesCount,
      allVotesCount: upVotesCount + downVotesCount,
    };
  }),
  addVote: publicProcedure
    .input(
      z.object({
        nullifier_hash: z.string().min(1),
        vote: z.enum(["UP", "DOWN"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const vote = await ctx.db.query.votes.findFirst({
        where: eq(votes.nullifier_hash, input.nullifier_hash),
      });
      if (vote) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only vote once.",
        });
      }
      await ctx.db.insert(votes).values(input).execute();
    }),
});
