import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getSubmissionById = internalQuery({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateModerationResults = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    results: v.any(),
  },
  handler: async (ctx, args) => {
    const { results } = args;

    // Check if flagged (threshold: 0.85 confidence)
    const isFlagged = results.status?.some((s: any) =>
      s.response?.output?.some((o: any) => o.score > 0.85)
    );

    await ctx.db.patch(args.submissionId, {
      status: isFlagged ? "flagged" : "active",
      moderationData: results,
      updatedAt: Date.now(),
    });
  },
});
