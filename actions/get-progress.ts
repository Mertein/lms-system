import { Course } from "@prisma/client"

import db from "@/lib/db"


type CoursesWithProgressWithCategory = {
  
}



export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);
    const validComptetedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersIds
        },
        isCompleted: true,
      },
    });

    const progressPercentage = (validComptetedChapters / publishedChapters.length) * 100;

    return progressPercentage;

    
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }


}