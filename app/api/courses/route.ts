import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const {title} = await req.json();
  const {userId} = auth();
  if(!userId) return new NextResponse('Unauthorized', { status: 401});

  try {
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES - POST]', error);
    return new NextResponse('Internal Server Error', { status: 500});
  }

}