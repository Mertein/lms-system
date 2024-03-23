import { auth } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { IconBadge } from "@/app/(dashboard)/_componentes/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { TitleForm } from "./_componentes/title-form";
import { DescriptionForm } from "./_componentes/description-form";
import { ImageForm } from "./_componentes/image-form";
import { CategoryForm } from "./_componentes/category-form";
export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.description,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((field) => field).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="ml-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Curso setup</h1>
          <span className="text-sm text-slate-700">
            Rellene todos los campos {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Personaliza tu curso</h2>
          </div>
          <TitleForm initialData={course} courseId={params.courseId} />
          <DescriptionForm initialData={course} courseId={params.courseId} />
          <ImageForm initialData={course} courseId={params.courseId} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
