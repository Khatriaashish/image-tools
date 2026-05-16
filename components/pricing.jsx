"use client";

import { useAuth } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const BILLING_ENABLED =
  process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED === "true";

const PRO_PLAN_ID = process.env.NEXT_PUBLIC_CLERK_BILLING_PLAN_ID_PRO || "";

export const plans = [
  {
    id: "free_user",
    name: "Free",
    price: "$0",
    note: "For quick edits",
    features: [
      "3 projects",
      "20 exports per month",
      "Crop, resize, adjust, text",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    note: "For AI edits and more output",
    planId: PRO_PLAN_ID,
    features: [
      "Unlimited projects",
      "Unlimited exports",
      "Background removal",
      "Image extension and AI edits",
    ],
  },
];

function PricingCard({ plan }) {
  const { has, isSignedIn } = useAuth();
  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false);
  const isCurrentPlan = has?.({ plan: plan.id }) || false;
  const isPaidPlan = Boolean(plan.planId);

  const handleUpgrade = async () => {
    if (isCurrentPlan) return;

    if (!isPaidPlan) return;

    if (!BILLING_ENABLED) {
      toast.info("Billing is not enabled yet. Free editing is available.");
      return;
    }

    if (!window.Clerk?.__internal_openCheckout) {
      toast.error("Checkout is not ready. Try again in a moment.");
      return;
    }

    try {
      setIsOpeningCheckout(true);
      await window.Clerk.__internal_openCheckout({
        planId: plan.planId,
        planPeriod: "month",
        subscriberType: "user",
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Could not open checkout.");
    } finally {
      setIsOpeningCheckout(false);
    }
  };

  return (
    <div className="border border-[#DADDE3] bg-white p-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#DADDE3] pb-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{plan.name}</h3>
          <p className="mt-2 text-sm text-[#6B7280]">{plan.note}</p>
        </div>
        <p className="text-4xl font-semibold text-[#111827]">
          {plan.price}
          {isPaidPlan && (
            <span className="text-sm font-normal text-[#6B7280]">/mo</span>
          )}
        </p>
      </div>

      <ul className="space-y-3 py-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-[#374151]">
            <Check className="mt-0.5 h-4 w-4 text-[#002FA7]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isPaidPlan ? (
        <Button
          variant="primary"
          className="w-full"
          onClick={handleUpgrade}
          disabled={isCurrentPlan || isOpeningCheckout}
        >
          {isOpeningCheckout && <Loader2 className="h-4 w-4 animate-spin" />}
          {isCurrentPlan ? "Current plan" : "Upgrade"}
        </Button>
      ) : (
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="block">
          <Button variant="glass" className="w-full">
            Start free
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function PricingSection() {
  return (
    <section
      className="border-b border-[#DADDE3] bg-[#F7F7F8] py-16"
      id="pricing"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-medium text-[#002FA7]">Pricing</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[#111827]">
              Start free. Upgrade when AI work grows.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#4B5563]">
            Free covers basic edits and exports. Pro removes project limits and
            unlocks AI background, extension, and editing tools.
          </p>
        </div>

        {!BILLING_ENABLED && (
          <div className="mb-6 border border-[#DADDE3] bg-white p-4 text-sm text-[#4B5563]">
            Checkout is disabled in this environment. Pricing is shown for
            planning; free editing remains available.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
