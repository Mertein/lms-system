import { CourseProgress } from "@/app/(course)/courses/[courseId]/_components/course-progress";
import { IconBadge } from "@/app/(dashboard)/_componentes/icon-badge";
import { formatPrice } from "@/lib/format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  progress: number;
  chaptersLength: number;
  imageUrl: string;
  category: string;
  price: number;
  id: string;
}

export const CourseCard = ({
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  id,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="border hover:shadow-sm rounded-lg p-3 h-full w-full overflow-hidden ">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} className="object-cover" fill />
        </div>
        <div className="flex flex-col p-2">
          <div className="md:text-base text-xl font-medium group-hover:text-sky-700 transition line-clamp-2 ">
            {title}
          </div>
          <p className="text-muted-foreground text-sm">{category}</p>
          <div className="flex items-center my-2 gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge icon={BookOpen} size={"sm"} />
              <span>
                {chaptersLength} {chaptersLength ? "Capítulos" : "Capítulo"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              value={progress}
              size="sm"
              variant={progress === 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-base md:text-sm font-medium text-slate-700 ">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
