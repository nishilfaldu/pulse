import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Cloudflare Stream webhook
http.route({
    path: "/stream-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // Verify webhook signature
        const signature = request.headers.get("Webhook-Signature");
        const timestamp = request.headers.get("Webhook-Timestamp");

        if (!signature || !timestamp) {
            console.error("Missing webhook signature or timestamp");
            return new Response("Unauthorized", { status: 401 });
        }

        const bodyText = await request.text();
        const body = JSON.parse(bodyText);

        // Verify HMAC-SHA256 signature
        const encoder = new TextEncoder();
        const data = encoder.encode(timestamp + "." + bodyText);
        const secret = encoder.encode(process.env.CLOUDFLARE_WEBHOOK_SECRET || "");

        const key = await crypto.subtle.importKey(
            "raw",
            secret,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const expectedSignature = await crypto.subtle.sign("HMAC", key, data);
        const expectedSigHex = Array.from(new Uint8Array(expectedSignature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (signature !== expectedSigHex) {
            console.error("Invalid webhook signature");
            return new Response("Unauthorized", { status: 401 });
        }

        console.log("Cloudflare Stream webhook received:", body);

        // Handle webhook event
        const { uid: videoId, status } = body;

        await ctx.runMutation(internal.submissions.internalUpdateVideoStatus, {
            videoId,
            status: status.state, // "ready" or "error"
        });

        return new Response(null, { status: 200 });
    }),
});

export default http;