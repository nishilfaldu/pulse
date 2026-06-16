import pushNotifications from "@convex-dev/expo-push-notifications/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(resend);
app.use(pushNotifications);

export default app;