import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      const patchData = {};

      if (user.name !== identity.name) {
        patchData.name = identity.name;
      }

      if (user.aiUsesUsed === undefined) {
        patchData.aiUsesUsed = 0;
      }

      if (Object.keys(patchData).length > 0) {
        await ctx.db.patch(user._id, patchData);
      }
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      imageUrl: identity.pictureUrl,
      plan: "free", // Default plan
      projectsUsed: 0, // Initialize usage counters
      exportsThisMonth: 0,
      aiUsesUsed: 0,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const consumeAiUsage = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.plan === "pro") {
      return {
        remaining: null,
        used: user.aiUsesUsed,
        isPro: true,
      };
    }

    if (user.aiUsesUsed >= 2) {
      throw new Error(
        "Free plan includes 2 AI uses. Upgrade to Pro for unlimited AI tools.",
      );
    }

    const currentAiUsesUsed = user.aiUsesUsed ?? 0;

    const aiUsesUsed = currentAiUsesUsed + 1;
    await ctx.db.patch(user._id, {
      aiUsesUsed,
      lastActiveAt: Date.now(),
    });

    return {
      remaining: Math.max(0, 2 - aiUsesUsed),
      used: aiUsesUsed,
      isPro: false,
    };
  },
});
