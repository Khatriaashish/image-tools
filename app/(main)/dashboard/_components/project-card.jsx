import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function ProjectCard({ project, onEdit }) {
  const { mutate: deleteProject, isLoading } = useConvexMutation(
    api.projects.deleteProject
  );

  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  const handleDelete = async () => {
    const confirmed = confirm(
      `Delete "${project.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteProject({ projectId: project._id });
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Could not delete project.");
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-none border-[#DADDE3] bg-white py-0 shadow-none transition-colors hover:border-[#002FA7]">
      <div className="relative aspect-video overflow-hidden bg-[#F7F7F8]">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#6B7280]">
            No preview
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="glass" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={handleDelete}
            className="gap-2 text-red-600 hover:text-red-700"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <CardContent className="pb-6">
        <h3 className="mb-1 truncate font-semibold text-[#111827]">
          {project.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-[#6B7280]">
          <span>Updated {lastUpdated}</span>
          <Badge
            variant="secondary"
            className="rounded-none bg-[#F7F7F8] text-xs text-[#4B5563]"
          >
            {project.width} x {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
