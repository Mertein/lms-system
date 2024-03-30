import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/db";
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

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("CHAPTER_ID", error);
    return new NextResponse("Interal Error" , { status: 500});
  }

}