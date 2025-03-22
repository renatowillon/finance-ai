import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return NextResponse.error();
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid":
      //atualizar o usuario com o novo plano
      const { customer, subscription, subscription_details } =
        event.data.object;
      const clerkUserid = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserid) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserid, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
  }
  return NextResponse.json({ received: true });
};
