import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import db from "@/lib/db";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
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
    console.log("COURSES_CHAPTER_ID", error);
    return new NextResponse("Interal Error" , { status: 500});
  }

}