import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./betterAuth/_generated/dataModel";

const pushNotifications = new PushNotifications<Id<"user">>(components.pushNotifications);

// convex/example.ts
export const recordPushNotificationToken = mutation({
    args: { token: v.string() },
    handler: async (ctx, args) => {
      const user = await authComponent.getAuthUser(ctx);
      if (!user) throw new Error("Not authenticated");

      await pushNotifications.recordToken(ctx, {
        userId: user._id,
        pushToken: args.token,
      });
    },
  });
  

//   // convex/example.ts
// export const sendPushNotification = mutation({
//     args: { title: v.string(), to: v.string() },
//     handler: async (ctx, args) => {
//       await pushNotifications.sendPushNotification(ctx, {
//         userId: args.to!,
//         notification: {
//           title: args.title,
//         },
//       });
//     },
//   });
  