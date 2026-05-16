"use client";

import React from "react";
import { Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PricingTable } from "@clerk/nextjs";
import { BILLING_ENABLED, plans } from "@/components/pricing";

export function UpgradeModal({ isOpen, onClose, restrictedTool, reason }) {
  const getToolName = (toolId) => {
    const toolNames = {
      background: "AI Background Tools",
      ai_extender: "AI Image Extender",
      ai_edit: "AI Editor",
      export: "Export limit",
      projects: "Project limit",
    };
    return toolNames[toolId] || "Pro feature";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white border-[#DADDE3] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-[#002FA7]" />
            <DialogTitle className="text-2xl font-semibold text-[#111827]">
              Upgrade
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Restriction Message */}
          {restrictedTool && (
            <Alert className="bg-[#F7F7F8] border-[#DADDE3]">
              <Zap className="h-5 w-5 text-[#002FA7]" />
              <AlertDescription className="text-[#4B5563]">
                <div className="font-semibold text-[#111827] mb-1">
                  {getToolName(restrictedTool)}
                </div>
                {reason ||
                  `${getToolName(restrictedTool)} is available on the Pro plan.`}
              </AlertDescription>
            </Alert>
          )}

          {BILLING_ENABLED ? (
            <PricingTable />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.id} className="border border-[#DADDE3] p-5">
                  <div className="flex items-start justify-between border-b border-[#DADDE3] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">{plan.note}</p>
                    </div>
                    <p className="text-2xl font-semibold text-[#111827]">
                      {plan.price}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-[#4B5563]">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-[#4B5563] hover:text-[#111827]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
