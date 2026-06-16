import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUploadUrl = action({
  args: {
    questId: v.id("quests"),
    duration: v.number(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Call Cloudflare API for Direct Creator Upload
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: 30,
          requireSignedURLs: false,
        }),
      }
    );

    const data = await response.json();
    console.log('Cloudflare response:', data);
    if (!data.success) {
      throw new Error(`Failed to get upload URL: ${JSON.stringify(data.errors)}`);
    }

    const { uid: videoId, uploadURL } = data.result;

    // Create pending submission record
    const submissionId: Id<"submissions"> = await ctx.runMutation(internal.submissions.createSubmission, {
      userId: user._id,
      questId: args.questId,
      videoId,
      duration: args.duration,
      fileSize: args.fileSize,
      caption: args.caption,
    });

    return {
      uploadUrl: uploadURL,
      videoId,
      submissionId,
    };
  },
});

export const createSubmission = internalMutation({
  args: {
    userId: v.string(),
    questId: v.id("quests"),
    videoId: v.string(),
    duration: v.number(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", {
      userId: args.userId,
      questId: args.questId,
      cloudflareVideoId: args.videoId,
      playbackUrl: `https://${process.env.CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${args.videoId}/manifest/video.m3u8`,
      duration: args.duration,
      fileSize: args.fileSize,
      caption: args.caption,
      status: "uploading",
      reactions: { skull: 0, salute: 0, fire: 0, eye: 0 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const markUploadComplete = mutation({
  args: {
    submissionId: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.userId !== user._id) {
      throw new Error("Submission not found");
    }

    await ctx.db.patch(args.submissionId, {
      status: "active",
      updatedAt: Date.now(),
    });

    // Schedule moderation check
    // await ctx.scheduler.runAfter(0, internal.moderation.triggerModeration, {
    //   submissionId: args.submissionId,
    // });
  },
});

export const internalUpdateVideoStatus = internalMutation({
  args: {
    videoId: v.string(),
    status: v.union(v.literal("ready"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db
      .query("submissions")
      .filter(q => q.eq(q.field("cloudflareVideoId"), args.videoId))
      .first();

    if (!submission) return;

    if (args.status === "ready") {
      await ctx.db.patch(submission._id, {
        status: "active",
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(submission._id, {
        status: "rejected",
        updatedAt: Date.now(),
      });
    }
  },
});

export const getFeedSubmissions = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get active quest
    const activeQuest = await ctx.db
      .query("quests")
      .order("desc")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeQuest) {
      return {
        page: [],
        continueCursor: "",
        isDone: true,
      };
    }

    // Get submissions for active quest with pagination
    const result = await ctx.db
      .query("submissions")
      .withIndex("by_quest_active", q =>
        q.eq("questId", activeQuest._id).eq("status", "active")
      )
      .order("desc")
      .paginate(args.paginationOpts);

    // Join with user and quest data
    const page = await Promise.all(
      result.page.map(async (sub) => {
        const user = await ctx.runQuery(components.betterAuth.users.getUserById, {
          userId: sub.userId,
        });
        const quest = await ctx.db.get(sub.questId);

        // Get my reactions
        let myReactions: string[] = [];
        const currentUser = await authComponent.getAuthUser(ctx);
        if (currentUser) {
          const reactions = await ctx.db
            .query("userReactions")
            .withIndex("by_user_submission", q =>
              q.eq("userId", currentUser._id).eq("submissionId", sub._id)
            )
            .collect();
          myReactions = reactions.map(r => r.type);
        }

        return {
          ...sub,
          user: user ? { username: user.username, name: user.name } : null,
          quest: quest ? { count: quest.count, title: quest.title } : null,
          myReactions,
        };
      })
    );

    return {
      ...result,
      page,
    };
  },
});

export const getMySubmission = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    // Get active quest
    const activeQuest = await ctx.db
      .query("quests")
      .order("desc")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeQuest) return null;

    // Get user's submission for this quest
    const submission = await ctx.db
      .query("submissions")
      .withIndex("by_quest_user", (q) =>
        q.eq("questId", activeQuest._id).eq("userId", user._id)
      )
      .first();

    if (!submission || submission.status === "deleted") {
      return null;
    }

    return {
      ...submission,
      quest: {
        title: activeQuest.title,
        count: activeQuest.count,
      },
    };
  },
});

export const deleteSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    if (submission.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.submissionId, {
      status: "deleted",
      updatedAt: Date.now(),
    });
  },
});

export const reactToSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
    type: v.union(v.literal("skull"), v.literal("salute"), v.literal("fire"), v.literal("eye")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    // Check if user already reacted with this type
    const existingReaction = await ctx.db
      .query("userReactions")
      .withIndex("by_user_submission_type", q =>
        q.eq("userId", user._id).eq("submissionId", args.submissionId).eq("type", args.type)
      )
      .first();

    if (existingReaction) {
      // Remove reaction
      await ctx.db.delete(existingReaction._id);

      // Decrement count
      await ctx.db.patch(args.submissionId, {
        reactions: {
          ...submission.reactions,
          [args.type]: Math.max(0, submission.reactions[args.type] - 1),
        },
      });
    } else {
      // Add reaction
      await ctx.db.insert("userReactions", {
        userId: user._id,
        submissionId: args.submissionId,
        type: args.type,
      });

      // Increment count
      await ctx.db.patch(args.submissionId, {
        reactions: {
          ...submission.reactions,
          [args.type]: submission.reactions[args.type] + 1,
        },
      });
    }
  },
});
