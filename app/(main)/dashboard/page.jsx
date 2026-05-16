"use client";

import React, { useState } from "react";
import { Plus, Image, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewProjectModal } from "./_components/new-project-modal";
import { ProjectGrid } from "./_components/project-grid";
import Link from "next/link";

export default function DashboardPage() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  if (authLoading) {
    return <DashboardLoadingState />;
  }

  if (!isAuthenticated) {
    return <SignedOutState />;
  }

  return (
    <AuthenticatedDashboard
      showNewProjectModal={showNewProjectModal}
      setShowNewProjectModal={setShowNewProjectModal}
    />
  );
}

function AuthenticatedDashboard({
  showNewProjectModal,
  setShowNewProjectModal,
}) {
  // Get user's projects
  const { data: projects, isLoading } = useConvexQuery(
    api.projects.getUserProjects
  );

  return (
    <div className="min-h-screen bg-[#F7F7F8] pt-28 pb-16">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#DADDE3] pb-8">
          <div>
            <p className="text-sm font-medium text-[#002FA7]">Projects</p>
            <h1 className="mt-2 text-4xl font-semibold text-[#111827]">
              Your images
            </h1>
            <p className="mt-2 text-[#4B5563]">
              Upload an image, edit it, and export the final file.
            </p>
          </div>

          <Button
            onClick={() => setShowNewProjectModal(true)}
            variant="primary"
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            New image
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DADDE3] border-b-[#002FA7]"></div>
          </div>
        ) : projects && projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <EmptyState onCreateProject={() => setShowNewProjectModal(true)} />
        )}

        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
        />
      </div>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] pt-28 pb-16 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
    </div>
  );
}

function SignedOutState() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] pt-28 pb-16 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#DADDE3] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#002FA7]/10 text-[#002FA7]">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold text-[#111827]">Sign in required</h1>
        <p className="mt-3 text-sm leading-6 text-[#4B5563]">
          Your projects are protected by Convex auth. Sign in to load the
          dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#002FA7] px-4 text-sm font-medium text-white transition-colors hover:bg-[#00258a]"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

// Empty state when user has no projects
function EmptyState({ onCreateProject }) {
  return (
    <div className="flex flex-col items-center justify-center border border-[#DADDE3] bg-white py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center border border-[#DADDE3]">
        <Image className="h-10 w-10 text-[#002FA7]" />
      </div>

      <h3 className="mb-3 text-2xl font-semibold text-[#111827]">
        Start with one image
      </h3>

      <p className="mb-8 max-w-md text-[#4B5563]">
        Upload a PNG, JPG, WebP, or GIF. ChitraMingle opens the editor as soon
        as the project is ready.
      </p>

      <Button
        onClick={onCreateProject}
        variant="primary"
        size="xl"
      className="gap-2"
      >
        <Plus className="h-5 w-5" />
        Upload image
      </Button>
    </div>
  );
}
