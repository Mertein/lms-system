import { auth } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { IconBadge } from "@/app/(dashboard)/_componentes/icon-badge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { TitleForm } from "./_componentes/title-form";
import { DescriptionForm } from "./_componentes/description-form";
import { ImageForm } from "./_componentes/image-form";
import { CategoryForm } from "./_componentes/category-form";
import { PriceForm } from "./_componentes/price-form";
import { AttachmentForm } from "./_componentes/attachment-form";
import { ChaptersForm } from "./_componentes/chapter-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_componentes/actions";
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
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
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
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner
          label={
            "Este Curso no esta publicado. No sera visible en la plataforma"
          }
          variant={"warning"}
        />
      )}
      <div className="ml-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Curso setup</h1>
            <span className="text-sm text-slate-700">
              Rellene todos los campos {completionText}
            </span>
          </div>
          <Actions
            courseId={params.courseId}
            disabled={!isComplete}
            isPublished={course.isPublished}
          />
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 ">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Capitulos del Curso</h2>
              </div>
              <div>
                <ChaptersForm initialData={course} courseId={params.courseId} />
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Vende tu curso</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Recursos & Archivos</h2>
            </div>
            <AttachmentForm initialData={course} courseId={params.courseId} />
          </div>
        </div>
      </div>
    </>
  );
}
