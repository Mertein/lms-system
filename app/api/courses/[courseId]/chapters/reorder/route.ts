import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request, {params} : {params: {courseId: string}}) {
  try {
    const { list } = await req.json();
    const {userId} = auth();
    if(!userId) return new NextResponse("Unauthorized" , {status: 401});
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    });
    if(!courseOwner) return new NextResponse("Unauthorized" , {status: 401});
      
    for(const chapter of list) {
      await db.chapter.update({
        where: {
          id: chapter.id
        },
        data: {
          position: chapter.position,
        }
      })
    }
    return new NextResponse("Success!" , {status: 200});
  } catch (error) {
    console.log("CHAPTERS REORDER", error);
    return new NextResponse("Internal server error" , {status: 500});
  }
}