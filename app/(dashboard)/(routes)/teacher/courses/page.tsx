import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_componentes/data-table";
import { columns } from "./_componentes/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const data = await db.course.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CoursesPage;
