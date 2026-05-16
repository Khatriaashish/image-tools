"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { UpgradeModal } from "@/components/upgrade-modal";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatFileRejection(rejection) {
  const code = rejection?.errors?.[0]?.code;
  if (code === "file-too-large") return "Image must be 20MB or smaller.";
  if (code === "file-invalid-type") return "Use PNG, JPG, WebP, or GIF.";
  return "Could not use that file.";
}

export function NewProjectModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { mutate: createProject } = useConvexMutation(api.projects.create);
  const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const { canCreateProject, isFree } = usePlanAccess();
  const router = useRouter();

  const currentProjectCount = projects?.length || 0;
  const canCreate = canCreateProject(currentProjectCount);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProjectTitle(file.name.replace(/\.[^/.]+$/, "") || "Untitled image");
    },
    [previewUrl]
  );

  const onDropRejected = useCallback((fileRejections) => {
    toast.error(formatFileRejection(fileRejections[0]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: !canCreate || isUploading,
  });

  const handleCreateProject = async () => {
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedFile) {
      toast.error("Select an image first.");
      return;
    }

    if (!projectTitle.trim()) {
      toast.error("Add a project name.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);

      const uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      let uploadData = null;
      try {
        uploadData = await uploadResponse.json();
      } catch {
        throw new Error("Upload service returned an invalid response.");
      }

      if (!uploadResponse.ok || !uploadData?.success) {
        throw new Error(uploadData?.error || "Upload failed.");
      }

      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });

      toast.success("Image ready");
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Could not create project.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    clearSelection();
    onClose();
  };

  const handleOpenChange = (open) => {
    if (!open) handleClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl rounded-none border-[#DADDE3] bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-2xl font-semibold text-[#111827]">
                New image
              </DialogTitle>
              {isFree && (
                <Badge
                  variant="secondary"
                  className="rounded-none bg-[#F7F7F8] text-[#4B5563]"
                >
                  {currentProjectCount}/3 projects
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {isFree && currentProjectCount >= 2 && (
              <Alert className="border-[#DADDE3] bg-[#F7F7F8]">
                <Crown className="h-5 w-5 text-[#002FA7]" />
                <AlertDescription className="text-[#4B5563]">
                  <div className="mb-1 font-semibold text-[#111827]">
                    {currentProjectCount === 2
                      ? "One free project left"
                      : "Project limit reached"}
                  </div>
                  {currentProjectCount === 2
                    ? "This upload uses your last free project."
                    : "Free plan includes 3 projects. Upgrade for unlimited projects."}
                </AlertDescription>
              </Alert>
            )}

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`cursor-pointer border border-dashed p-12 text-center transition-colors ${
                  isDragActive
                    ? "border-[#002FA7] bg-[#F7F7F8]"
                    : "border-[#A7AFBC] hover:border-[#002FA7]"
                } ${!canCreate ? "pointer-events-none opacity-50" : ""}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 h-10 w-10 text-[#002FA7]" />
                <h3 className="mb-2 text-xl font-semibold text-[#111827]">
                  {isDragActive ? "Drop image" : "Upload image"}
                </h3>
                <p className="mb-4 text-[#4B5563]">
                  {canCreate
                    ? "Drag an image here, or click to browse."
                    : "Upgrade to create more projects."}
                </p>
                <p className="text-sm text-[#6B7280]">
                  PNG, JPG, WebP, GIF. Max 20MB.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Selected image preview"
                    className="h-64 w-full border border-[#DADDE3] object-cover"
                  />
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={clearSelection}
                    className="absolute right-2 top-2"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-title" className="text-[#111827]">
                    Project name
                  </Label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(event) => setProjectTitle(event.target.value)}
                    placeholder="Name this image"
                    className="rounded-none border-[#DADDE3] bg-white text-[#111827] placeholder:text-[#6B7280] focus:border-[#002FA7] focus:ring-[#002FA7]"
                    disabled={isUploading}
                  />
                </div>

                <div className="border border-[#DADDE3] bg-[#F7F7F8] p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-[#002FA7]" />
                    <div>
                      <p className="font-medium text-[#111827]">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isUploading}
              className="text-[#4B5563] hover:text-[#111827]"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateProject}
              disabled={!selectedFile || !projectTitle.trim() || isUploading}
              variant="primary"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                "Open editor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        restrictedTool="projects"
        reason="Free plan includes 3 projects. Upgrade for unlimited projects and AI tools."
      />
    </>
  );
}
