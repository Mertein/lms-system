import { IconBadge } from "@/app/(dashboard)/_componentes/icon-badge";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { ChapterTitleForm } from "./_componentes/chapter-title-form";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { ChapterDescriptionForm } from "./_componentes/chapter-description-form";
import { ChapterAccessForm } from "./_componentes/chapter-access-form";
import { ChapterVideoForm } from "./_componentes/chapter-video-form";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");
  const chapter = await db.chapter.findUnique({
    where: {
      courseId: params.courseId,
      id: params.chapterId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al curso
          </Link>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Creacion del capitulo</h1>
              <span className="text-sm text-slate-700">
                {" "}
                Rellene todos los campos {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Personalice su capitulo</h2>
          </div>
          <ChapterTitleForm
            courseId={params.courseId}
            chapterId={params.chapterId}
            initialData={chapter}
          />
          <ChapterDescriptionForm
            chapterId={params.chapterId}
            courseId={params.courseId}
            initialData={chapter}
          />
          <ChapterAccessForm
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Agregar un Video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
