"use client";

import { Button } from "@/components/ui/button";
import { useConffetiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConffetiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        },
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Tu progreso ha sido actualizado.");
      router.refresh();
    } catch {
      toast.error(
        "Ocurrió un error al actualizar tu progreso. Intenta de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      disabled={isLoading}
    >
      {isCompleted ? "Marcar como incompleto" : "Marcar como completo"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};
