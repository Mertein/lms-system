"use client";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.includes(id);

  const onClick = () => {
    return router.push(`/courses/${courseId}/chapters/${id}`);
  };

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20  ",
        isActive &&
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isActive && isCompleted && "bg-emerald-200/20",
      )}
    >
      <div className="flex gap-x-2 py-4 items-center ">
        <Icon
          size={20}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700",
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all ",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700",
        )}
      />
    </button>
  );
};
