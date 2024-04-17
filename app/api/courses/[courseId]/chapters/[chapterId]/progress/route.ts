import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"
import db from "@/lib/db";

export async function put(req: Request, {params} : {params: {courseId: string, chapterId: string}}) {
  try {
    const {userId} = auth();
    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    };

    const isCompleted = await req.json();
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json( userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error)
    return new NextResponse("Internal server error" ,{status: 500});
  }
}