import { expo } from '@better-auth/expo';
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { emailOTP } from 'better-auth/plugins';
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { sendOTPVerification } from './email';

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
    components.betterAuth,
    {
        local: {
            schema: authSchema,
        },
    }
);

export const createAuth = (
    ctx: GenericCtx<DataModel>,
    { optionsOnly } = { optionsOnly: false },
) => {
    return betterAuth({
        // disable logging when createAuth is called just to generate options.
        // this is not required, but there's a lot of noise in logs without it.
        logger: {
            disabled: optionsOnly,
        },
        trustedOrigins: [
            "irl://",
            // Development mode - Expo's exp:// scheme with local IP ranges
            ...(process.env.NODE_ENV === "development" ? [
                "exp://*/*",                 // Trust all Expo development URLs
                "exp://10.0.0.*:*/*",        // Trust 10.0.0.x IP range
                "exp://192.168.*.*:*/*",     // Trust 192.168.x.x IP range
                "exp://172.*.*.*:*/*",       // Trust 172.x.x.x IP range
                "exp://localhost:*/*"        // Trust localhost
            ] : [])
        ],
        database: authComponent.adapter(ctx),
        advanced: {
            database: {
                generateId: false, // "serial" for auto-incrementing numeric IDs
            },
        },
        // Configure simple, non-verified email/password to get started
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        user: {
            additionalFields: {
                username: {
                    type: "string",
                    required: false,
                    defaultValue: "",
                    input: true,
                },
                phone: {
                    type: "string",
                    required: false,
                    defaultValue: "",
                    input: true,
                },
                phoneVerified: {
                    type: "boolean",
                    required: false,
                    defaultValue: false,
                    input: false,
                },
            },
        },
        plugins: [
            // The Expo and Convex plugins are required
            expo(),
            convex(),
            emailOTP({
                overrideDefaultEmailVerification: true, 
                otpLength: 6,
                expiresIn: 600,
                sendVerificationOnSignUp: true,
                async sendVerificationOTP({ email, otp }) {
                    console.log(email, otp);
                  await sendOTPVerification(requireActionCtx(ctx), {
                    to: email,
                    code: otp,
                  });
                },
              }),
            // phoneNumber({
            //     sendOTP: async ({ phoneNumber, code }) => {
            //         console.log(`📱 [DEBUG] sendOTP called for ${phoneNumber} with code: ${code}`);
            //         console.log(`💡 [DEV] Use this code in the app: ${code}`);

            //         // TODO: Implement SMS provider for production (Twilio, AWS SNS, etc.)
            //         // try {
            //         //     const client = twilio(
            //         //         process.env.TWILIO_ACCOUNT_SID,
            //         //         process.env.TWILIO_AUTH_TOKEN
            //         //     );
            //         //     await client.messages.create({
            //         //         body: `Your verification code is: ${code}`,
            //         //         from: process.env.TWILIO_PHONE_NUMBER,
            //         //         to: phoneNumber,
            //         //     });
            //         // } catch (error) {
            //         //     console.error("Failed to send SMS:", error);
            //         //     if (process.env.NODE_ENV !== "development") {
            //         //         throw error;
            //         //     }
            //         // }
            //     },
            //     expiresIn: 300, // 5 minutes
            //     otpLength: 6,
            //     allowedAttempts: 3,
            // }),
        ],
    });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return authComponent.getAuthUser(ctx);
    },
});