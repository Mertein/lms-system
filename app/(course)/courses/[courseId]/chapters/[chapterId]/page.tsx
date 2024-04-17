import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      <div className="mb-6 text-white">
        {userProgress?.isCompleted && (
          <Banner label={"Ya has completado este Capitulo"} variant="success" />
        )}
        {isLocked && (
          <Banner
            label={"Necesitas comprar este curso para poder ver el Capitulo"}
            variant="warning"
          />
        )}
      </div>
      <div className="flex flex-col w-full mx-auto pb-20 ">
        <VideoPlayer
          chapterId={params.chapterId}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?.id!}
          playBackId={muxData?.playbackId!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
      </div>
      <div className="flex flex-col md:flex-row p-4 justify-between items-center ">
        <h2 className="text-2xl font-semibold mb-2 ">{chapter.title}</h2>
        {purchase ? (
          <CourseProgressButton
            chapterId={params.chapterId}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isCompleted={!!userProgress?.isCompleted}
          />
        ) : (
          <CourseEnrollButton
            courseId={params.courseId}
            price={course.price!}
          />
        )}
      </div>
      <Separator />
      <div>
        <Preview value={chapter.description!} />
      </div>
      {!!attachments.length && (
        <>
          <Separator />
          <div className="p-4">
            {attachments.map((attachment) => (
              <a
                href={attachment.url}
                key={attachment.id}
                target="_blank"
                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
              >
                <File className="h-4 w-4" />
                <p className="line-clamp-1">{attachment.name}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default ChapterIdPage;
