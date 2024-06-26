import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(
  req: Request,
  {params} : {params: {courseId: string}}
) {
  try {
    const {userId} = auth();
    const {title} = await req.json();
    const {courseId} = params;
    if(!userId) {
      return new NextResponse("No autorizado", {status: 401});
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      }
    })
    if(!courseOwner) {
      return new NextResponse("No autorizado", {status: 401});
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc"
      }
    });


    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title, 
        courseId,
        position: newPosition
      },
    });
    return NextResponse.json(chapter);
    
  } catch (error) {
    console.log("CHAPTERS", error);
    return new NextResponse("Internal server error", {status: 500})
  }

  





}