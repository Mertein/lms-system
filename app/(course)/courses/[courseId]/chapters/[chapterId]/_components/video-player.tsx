interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playBackId?: string | null;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playBackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  return (
    <div>
      <p>dsds</p>
    </div>
  );
};
