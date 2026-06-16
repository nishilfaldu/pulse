import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    quests: defineTable({
        title: v.string(),
        description: v.string(),
        isActive: v.boolean(),
        count: v.number(),
    }),

    questCompletions: defineTable({
        userId: v.string(),
        questId: v.id("quests"),
        completedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_quest", ["questId"])
        .index("by_user_quest", ["userId", "questId"]),

    submissions: defineTable({
        userId: v.string(),
        questId: v.id("quests"),

        // Cloudflare Stream
        cloudflareVideoId: v.string(),
        playbackUrl: v.string(),
        thumbnailUrl: v.optional(v.string()),

        // Metadata
        duration: v.number(),
        fileSize: v.number(),
        caption: v.optional(v.string()),

        // Moderation
        status: v.union(
            v.literal("uploading"),
            v.literal("processing"),
            v.literal("active"),
            v.literal("flagged"),
            v.literal("rejected"),
            v.literal("deleted")
        ),
        moderationData: v.optional(v.any()),

        // Reactions
        reactions: v.object({
            skull: v.number(),
            salute: v.number(),
            fire: v.number(),
            eye: v.number(),
        }),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_quest", ["questId"])
        .index("by_status", ["status"])
        .index("by_quest_active", ["questId", "status"])
        .index("by_quest_user", ["questId", "userId"]),

    userReactions: defineTable({
        userId: v.string(),
        submissionId: v.id("submissions"),
        type: v.union(v.literal("skull"), v.literal("salute"), v.literal("fire"), v.literal("eye")),
    })
        .index("by_user_submission", ["userId", "submissionId"])
        .index("by_user_submission_type", ["userId", "submissionId", "type"])
        .index("by_submission", ["submissionId"]),
});
