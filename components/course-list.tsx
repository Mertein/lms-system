"use client";

import { Category, Course } from "@prisma/client";
import { CourseCard } from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

export const CourseList = ({ items }: CourseListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <CourseCard
          key={item.id}
          title={item.title}
          id={item.id}
          progress={item.progress!}
          imageUrl={item.imageUrl!}
          category={item.category?.name!}
          price={item.price!}
          chaptersLength={item.chapters.length}
        />
      ))}
    </div>
  );
};
