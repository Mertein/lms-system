import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  {params} : {params: {courseId: string, chapterId: string}},
) {
    try {
    const {userId} = auth();
    if(!userId) return new NextResponse("No autorizado", { status: 401});

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if(!ownCourse) return new NextResponse("No autorizado", { status: 401});

    const existingChapter = await db.chapter.findUnique({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      }
    })

    if(!existingChapter) return new NextResponse("Not Found", {status: 404});

    if(existingChapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
      });

      if(existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId); 
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      };
    };

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if(!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    };
    revalidatePath(`/teacher/courses/${params.courseId}`);
    return NextResponse.json(deletedChapter);
    
  } catch (error) {
    console.log('[COURSE_CHAPTER_ID_DELETE]', error);
    return new NextResponse("Internal Error", {status: 500});
  }
}

export async function PATCH(req: Request, {params} : {params: {courseId: string, chapterId: string}}) {
  try {
    const {isPublished, ...values} = await req.json();
    const {userId} = auth();

    if(!userId) return new NextResponse("No autorizado", { status: 401});
    
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if(!ownCourse) return new NextResponse("No autorizado", { status: 401});

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values
      }
    });

    if(values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
      });

      if(existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId); 
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      };
      
      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          playbackId: asset.playback_ids?.[0]?.id,
          assetId: asset.id,
        },
      });

    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Interal Error" , { status: 500});
  }

}