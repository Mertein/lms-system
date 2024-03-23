import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";


export async function PATCH(req: Request, {params} : {params: {courseId: string}}) {

  
  const values = await req.json();
  try {
    const {userId} = auth();

    if(!userId) return new NextResponse("No autorizado", { status: 401});

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("COURSE_ID", error);
    return new NextResponse("Interal Error" , { status: 500});
  }

}