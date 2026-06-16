"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const triggerModeration = internalAction({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.runQuery(internal.moderationQueries.getSubmissionById, {
      id: args.submissionId
    });

    if (!submission) return;

    // Call Hive AI API
    const response = await fetch('https://api.thehive.ai/api/v2/task/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.HIVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: submission.playbackUrl,
        classes: ['yes_nsfw', 'yes_violence', 'yes_hate_speech'],
      })
    });

    const data = await response.json();

    // Store results
    await ctx.runMutation(internal.moderationQueries.updateModerationResults, {
      submissionId: args.submissionId,
      results: data,
    });
  },
});
