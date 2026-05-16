// hooks/use-plan-access.js
import { useAuth } from "@clerk/nextjs";

export function usePlanAccess(user = null) {
  const { has } = useAuth();

  const isPro = has?.({ plan: "pro" }) || user?.plan === "pro" || false;
  const isFree = !isPro; // If not pro, then free (default)
  const aiUsesUsed = user?.aiUsesUsed ?? 0;
  const freeAiUsesLeft = isPro ? null : Math.max(0, 2 - aiUsesUsed);
  const canUseAiTools = isPro || aiUsesUsed < 2;

  // Define which tools are available for each plan
  const planAccess = {
    // Free plan tools
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // AI tools are available to free users for 2 uses total
    background: canUseAiTools,
    ai_extender: canUseAiTools,
    ai_edit: canUseAiTools,
  };

  // Helper function to check if user has access to a specific tool
  const hasAccess = (toolId) => {
    return planAccess[toolId] === true;
  };

  // Get restricted tools that user doesn't have access to
  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };

  // Check if user has reached project limits
  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    return currentProjectCount < 3; // Free limit
  };

  // Check if user has reached export limits
  const canExport = (currentExportsThisMonth) => {
    if (isPro) return true;
    return currentExportsThisMonth < 20;
  };

  const getRestrictionReason = (toolId) => {
    if (isPro) return null;

    if (["background", "ai_extender", "ai_edit"].includes(toolId)) {
      if (freeAiUsesLeft === 0) {
        return "Free plan includes 2 AI uses total. Upgrade to Pro for unlimited AI tools.";
      }
      return `Free plan includes ${freeAiUsesLeft} AI use${freeAiUsesLeft === 1 ? "" : "s"} left.`;
    }

    return null;
  };

  return {
    userPlan: isPro ? "pro" : "free_user",
    isPro,
    isFree,
    aiUsesUsed,
    freeAiUsesLeft,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
    getRestrictionReason,
  };
}
