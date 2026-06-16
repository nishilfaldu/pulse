import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const updateUsername = mutation({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        // Check uniqueness in the Better Auth user table (via component)
        const isTaken = await ctx.runQuery(components.betterAuth.users.checkUsername, {
            username: args.username,
        });

        if (isTaken) {
            throw new Error("Username taken");
        }

        // Update the user in the Better Auth component
        await ctx.runMutation(components.betterAuth.users.updateUsername, {
            userId: user._id,
            username: args.username,
        });
    },
});

export const checkUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        // Check if username exists in the Better Auth user table (via component)
        return await ctx.runQuery(components.betterAuth.users.checkUsername, {
            username: args.username,
        });
    },
});
