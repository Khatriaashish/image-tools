"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, LogIn, Monitor } from "lucide-react";
import { EditorTopBar } from "./_components/editor-topbar";
import { EditorSidebar } from "./_components/editor-sidebar";
import CanvasEditor from "./_components/canvas";
import { CanvasContext } from "@/context/context";
import { RingLoader } from "react-spinners";
import Link from "next/link";

export default function EditorPage() {
  const params = useParams();
  const projectId = params.projectId;
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  if (authLoading) {
    return <LoadingState label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <SignedOutState />;
  }

  return <AuthenticatedEditor projectId={projectId} />;
}

function AuthenticatedEditor({ projectId }) {
  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState("resize");

  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, { projectId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
          <p className="text-[#4B5563]">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="border border-[#DADDE3] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#111827] mb-2">
            Project not found
          </h1>
          <p className="text-[#4B5563]">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        activeTool,
        onToolChange: setActiveTool,
        processingMessage,
        setProcessingMessage,
      }}
    >
      {/* Mobile Message - Show on screens smaller than lg (1024px) */}
      <div className="lg:hidden min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
        <div className="max-w-md border border-[#DADDE3] bg-white p-8 text-center">
          <Monitor className="h-12 w-12 text-[#002FA7] mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-[#111827] mb-4">
            Desktop required
          </h1>
          <p className="text-[#4B5563] text-lg mb-2">
            This editor is only usable on desktop.
          </p>
          <p className="text-[#6B7280] text-sm">
            Please use a larger screen to access the full editing experience.
          </p>
        </div>
      </div>

      {/* Desktop Editor - Show on lg screens and above */}
      <div className="editor-shell hidden lg:block min-h-screen bg-white">
        <div className="flex flex-col h-screen">
          {processingMessage && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="border border-[#DADDE3] bg-white p-6 flex flex-col items-center gap-4">
                <RingLoader color="#002FA7" />
                <div className="text-center">
                  <p className="text-[#111827] font-medium">{processingMessage}</p>
                  <p className="text-[#6B7280] text-sm mt-1">
                    Please wait, do not switch tabs or navigate away
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar */}
          <EditorTopBar project={project} />

          {/* Main Editor Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <EditorSidebar project={project} />

            {/* Canvas Area */}
            <div className="flex-1 bg-[#F7F7F8]">
              <CanvasEditor project={project} activeTool={activeTool} />
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}

function LoadingState({ label }) {
  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
        <p className="text-[#4B5563]">{label}</p>
      </div>
    </div>
  );
}

function SignedOutState() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-[#DADDE3] bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-[#DADDE3] text-[#002FA7]">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold text-[#111827]">Sign in required</h1>
        <p className="mt-3 text-sm leading-6 text-[#4B5563]">
          This editor uses authenticated Convex queries. Sign in again, then
          reopen the project.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/sign-in"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#002FA7] px-4 text-sm font-medium text-white transition-colors hover:bg-[#002985]"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
