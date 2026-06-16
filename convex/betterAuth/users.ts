import { doc } from "convex-helpers/validators";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import schema from "./schema";

/**
 * Check if a username already exists
 */
export const checkUsername = query({
    args: { username: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("user")
            .withIndex("username", (q) => q.eq("username", args.username))
            .first();
        return !!existing;
    },
});

/**
 * Get user by username
 */
export const getUserByUsername = query({
    args: { username: v.string() },
    returns: v.union(v.null(), doc(schema, "user")),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("user")
            .withIndex("username", (q) => q.eq("username", args.username))
            .first();
    },
});

/**
 * Get user by ID
 */
export const getUserById = query({
    args: { userId: v.id("user") },
    returns: v.union(v.null(), doc(schema, "user")),
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

/**
 * Update user's username
 */
export const updateUsername = mutation({
    args: {
        userId: v.id("user"),
        username: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { username: args.username });
        return null;
    },
});
