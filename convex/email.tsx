import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/components";
import React from "react";
import { components } from "./_generated/api";
import { type ActionCtx } from "./_generated/server";
import VerifyOTP from "./emails/verifyOTP";
import "./polyfills";

export const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendOTPVerification = async (
  ctx: ActionCtx,
  {
    to,
    code,
  }: {
    to: string;
    code: string;
  },
) => {
  await resend.sendEmail(ctx, {
    from: "Test <verify@auth.7west.space>",
    to,
    subject: "Verify your email address",
    html: await render(<VerifyOTP code={code} />),
  });
};