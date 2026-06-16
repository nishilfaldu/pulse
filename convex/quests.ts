import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getActiveQuest = query({
    args: {},
    handler: async (ctx) => {
        const quest = await ctx.db
            .query("quests")
            .filter((q) => q.eq(q.field("isActive"), true))
            .first();
        return quest;
    },
});

export const hasCompletedTodaysQuest = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) return false;

        const activeQuest = await ctx.db
            .query("quests")
            .order("desc")
            .filter((q) => q.eq(q.field("isActive"), true))
            .first();

        if (!activeQuest) return false;

        const completion = await ctx.db
            .query("questCompletions")
            .withIndex("by_user_quest", (q) =>
                q.eq("userId", user._id).eq("questId", activeQuest._id)
            )
            .first();

        return !!completion;
    },
});

export const completeQuest = mutation({
    args: { questId: v.id("quests") },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        // Check if already completed
        const existing = await ctx.db
            .query("questCompletions")
            .withIndex("by_user_quest", (q) =>
                q.eq("userId", user._id).eq("questId", args.questId)
            )
            .first();

        if (existing) return existing._id;

        // Mark as completed
        const completionId = await ctx.db.insert("questCompletions", {
            userId: user._id,
            questId: args.questId,
            completedAt: Date.now(),
        });

        return completionId;
    },
});

export const seedQuest = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get the last quest to find the highest count
        const lastQuest = await ctx.db
            .query("quests")
            .order("desc")
            .first();

        // Increment count from last quest, or start at 1 if no quests exist
        const newCount = lastQuest ? (lastQuest.count ?? 0) + 1 : 1;

        const questId = await ctx.db.insert("quests", {
            title: args.title,
            description: args.description,
            isActive: args.isActive,
            count: newCount,
        });
        return questId;
    },
});
